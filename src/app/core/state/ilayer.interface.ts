import { PaletteEntry } from "./palette-entry.model";

// Generic layer...?
export interface ILayer {
  name: string;

  // Function for drawing the layer onto the canvas
  drawLayer(ctx: CanvasRenderingContext2D, palette: PaletteEntry[]): void;
}