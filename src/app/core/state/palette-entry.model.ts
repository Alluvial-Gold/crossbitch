import { Floss } from "./floss.model";
import { PatternSymbol } from "./pattern-symbol.model";

export interface PaletteEntry {

  floss: Floss;

  // Cross stitch options
  symbol: PatternSymbol;
  strands: number;

  // TODO: back stitch options
  // strands
  // line type

}