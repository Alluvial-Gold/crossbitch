import { CanvasSettings } from "./canvas-settings.model";
import { ILayer } from "../state/ilayer.interface";
import { PaletteEntry } from "../state/palette-entry.model";

export interface ProjectModel {

  name: string;

  canvasSettings: CanvasSettings;

  layers: ILayer[];
  currentLayerIndex: number;

  // TODO - should this be a map?
  palette: PaletteEntry[];
  currentPaletteColourIndex: number;

}