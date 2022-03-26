import { CanvasSettings } from "./canvas-settings.model";
import { Floss } from "./floss.model";
import { ILayer } from "./ilayer.interface";
import { PaletteEntry } from "./palette-entry.model";
import { PatternSymbol } from "./pattern-symbol.model";
import { SquareLayer } from "./square-layer.model";

/**
 * Project class
 */
export class Project {

  canvasSettings: CanvasSettings;

  layers: ILayer[];

  // TODO - should this be a map?
  palette: PaletteEntry[];

  constructor(newCanvasSettings: CanvasSettings) {
    this.canvasSettings = newCanvasSettings;

    // Start with single SquareLayer
    let layer1 = new SquareLayer("Square1", this.canvasSettings.rows, this.canvasSettings.columns);
    this.layers = [layer1];

    // Start with black
    let blackFloss = new Floss("Default black", "#000000");
    let blackFlossSymbol = new PatternSymbol("a");
    this.palette = [new PaletteEntry(blackFlossSymbol, blackFloss)];
  }

}