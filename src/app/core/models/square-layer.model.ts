import { SQUARE_SIZE } from "../constants";
import { ILayer } from "./ilayer.interface";
import { PaletteEntry } from "./palette-entry.model";

export class SquareLayer implements ILayer {

  name: string;

  // TODO...?
  palette: PaletteEntry[] = [];

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
    this.values[6][3] = 0;
    this.values[3][7] = 0;
    this.values[4][7] = 0;
    this.values[5][7] = 0;
    this.values[6][7] = 0;
    this.values[2][6] = 0;
    this.values[7][6] = 0;
  }

  // TODO - make this a service/store thing
  updatePalette(palette: PaletteEntry[]) {
    this.palette = palette;
  }

  // TODO - resize canvas

  drawLayer(ctx: CanvasRenderingContext2D): void {
    for (let rowIdx = 0; rowIdx < this.values.length; rowIdx++) {
      for (let colIdx = 0; colIdx < this.values[0].length; colIdx++) {
        let value = this.values[rowIdx][colIdx];

        if (value != -1) {
          // draw square
          ctx.fillStyle = this.palette[value].floss.colour;
          ctx.fillRect(rowIdx * SQUARE_SIZE, colIdx * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

          // TODO - other styles
        }
      }
    }
  }

}