import { CanvasSettings } from "./canvas-settings.model";
import { ILayer } from "../state/ilayer.interface";
import { PaletteEntry } from "../state/palette-entry.model";

export interface ProjectModel {

  canvasSettings: CanvasSettings;

  layers: ILayer[];

  // TODO - should this be a map?
  palette: PaletteEntry[];

}