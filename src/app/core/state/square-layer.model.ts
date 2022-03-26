import { SQUARE_SIZE } from "../constants";
import { ILayer } from "./ilayer.interface";
import { PaletteEntry } from "./palette-entry.model";

export class SquareLayer implements ILayer {

  name: string;

  // -1 = nothing
  // 0+ = palette :)
  values: number[][] = [];

  constructor(newName: string, rows: number, columns: number) {
    this.name = newName;

    // Set up values
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
      let row: number[] = []
      for (let colIdx = 0; colIdx < columns; colIdx++) {
        row.push(-1);
      }
      this.values.push(row);
    }

    // TEST - simple pattern
    this.values[3][3] = 0;
    this.values[3][6] = 0;
    this.values[7][3] = 0;
    this.values[7][4] = 0;
    this.values[7][5] = 0;
    this.values[7][6] = 0;
    this.values[6][2] = 0;
    this.values[6][7] = 0;
  }

  // TODO - resize canvas

  drawLayer(ctx: CanvasRenderingContext2D, palette: PaletteEntry[]): void {
    for (let rowIdx = 0; rowIdx < this.values.length; rowIdx++) {
      for (let colIdx = 0; colIdx < this.values[0].length; colIdx++) {
        let value = this.values[rowIdx][colIdx];

        if (value != -1) {
          // draw square
          ctx.fillStyle = palette[value].floss.colour;
          ctx.fillRect(colIdx * SQUARE_SIZE, rowIdx * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

          // TODO - other styles
        }
      }
    }
  }

}