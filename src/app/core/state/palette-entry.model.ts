import { Floss } from "./floss.model";
import { PatternSymbol } from "./pattern-symbol.model";

export class PaletteEntry {

  symbol: PatternSymbol;

  floss: Floss;

  constructor(symbol: PatternSymbol, floss: Floss) {
    this.symbol = symbol;
    this.floss = floss;
  }

}