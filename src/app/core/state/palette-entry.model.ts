import { Floss } from "./floss.model";

export interface PaletteEntry {

  floss: Floss;

  // Cross stitch options
  iconIndex: number;
  crossStitchStrands: number;

  // Backstitch options
  lineIndex: number;
  backstitchStrands: number;

}