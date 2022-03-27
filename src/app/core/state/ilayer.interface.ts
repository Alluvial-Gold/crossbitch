import { PaletteEntry } from "./palette-entry.model";

// Generic layer...?
export interface ILayer {
  name: string;

  // Function for drawing the crossstitch layer onto the canvas
  drawCrossstitchLayer(ctx: CanvasRenderingContext2D, palette: PaletteEntry[]): void;

  // Function for drawing the backstitch layer onto the canvas
  drawBackstitchLayer(ctx: CanvasRenderingContext2D, palette: PaletteEntry[]): void;
}