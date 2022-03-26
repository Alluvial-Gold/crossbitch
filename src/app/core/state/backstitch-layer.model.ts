import { ILayer } from "./ilayer.interface";
import { PaletteEntry } from "./palette-entry.model";

export class BackStitchLayer implements ILayer {

  name: string;

  // TODO lines...

  constructor(newName: string) {
    this.name = newName;
  }

  // TODO - resize canvas

  drawLayer(ctx: CanvasRenderingContext2D, palette: PaletteEntry[]): void {
    // TODO
  }

}