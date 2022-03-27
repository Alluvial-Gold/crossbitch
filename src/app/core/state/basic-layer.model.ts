import { SQUARE_SIZE } from "../constants";
import { ILayer } from "./ilayer.interface";
import { PaletteEntry } from "./palette-entry.model";

export class BasicLayer implements ILayer {

  name: string;

  // -1 = nothing
  // 0+ = palette :)
  crossstitches: (number | number[])[][] = [];

  // TODO backstitches

  constructor(newName: string, rows: number, columns: number) {
    this.name = newName;

    // Set up values
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
      let row: number[] = []
      for (let colIdx = 0; colIdx < columns; colIdx++) {
        row.push(-1);
      }
      this.crossstitches.push(row);
    }
  }

  setFullStitch(paletteIdx: number, rowIdx: number, columnIdx: number): void {
    this.crossstitches[rowIdx][columnIdx] = paletteIdx;
  }

  // TODO: set partial stitch

  drawLayer(ctx: CanvasRenderingContext2D, palette: PaletteEntry[]): void {
    for (let rowIdx = 0; rowIdx < this.crossstitches.length; rowIdx++) {
      for (let colIdx = 0; colIdx < this.crossstitches[0].length; colIdx++) {
        let value = this.crossstitches[rowIdx][colIdx];

        if (value != -1) {
          if (typeof value === 'number') {
            // Full square
            ctx.fillStyle = palette[value].floss.colour;
            ctx.fillRect(colIdx * SQUARE_SIZE, rowIdx * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
          } else {
            // TODO - partial square
          }
          // TODO - other styles
        }
      }
    }
  }

}