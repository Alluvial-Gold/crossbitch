import { Floss } from "./floss.model";
import { PatternSymbol } from "./pattern-symbol.model";

export interface PaletteEntry {

  symbol: PatternSymbol;

  // Number of strands
  strands: number;

  floss: Floss;

}