import { SQUARE_SIZE } from "../constants";
import { ILayer } from "./ilayer.interface";
import { PaletteEntry } from "./palette-entry.model";

// TODO move
export interface BackstitchLine {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  paletteIdx: number;
}

export class BasicLayer implements ILayer {

  name: string;

  // -1 = nothing
  // 0+ = palette :)
  // multiple numbers: partial stitches
  crossstitches: (number | number[])[][] = [];

  backstitches: BackstitchLine[] = [];

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

  addBackStitch(newBackstitch: BackstitchLine): void {
    this.backstitches.push(newBackstitch);
  }

  updateBackStitch(updatedBackstitch: BackstitchLine): void {
    let backstitch = this.backstitches.find(b => b.id == updatedBackstitch.id);
    if (backstitch) {
      backstitch = {
        ...updatedBackstitch
      }
    }
  }

  removeBackstitch(clickedX: number, clickedY: number): number {
    // Find all...

    // todo: line length?
    let tolerance = 1000;

    let backstitchesToRemove = this.backstitches.filter(b => {
      let lowX = Math.min(b.startX, b.endX);
      let highX = Math.max(b.startX, b.endX);
      let lowY = Math.min(b.startY, b.endY);
      let highY = Math.max(b.startY, b.endY);

      if (lowX < clickedX && clickedX < highX &&
          lowY < clickedY && clickedY < highY) {
          // (a, b), (m, n) (x, y) colinear if
          // (n - b)(x - m) = (y - n)(m - a)
          // (a: startX, b: startY), (m: endX, n: endY), (x: clickedX, y: clickedY)
          let leftSide = (b.endY - b.startY) * (clickedX - b.endX);
          let rightSide = (clickedY - b.endY) * (b.endX - b.startX);
          let diff = Math.abs(leftSide - rightSide);

          return diff < tolerance;
      }
      return false;
    });

    for (let bIdx = 0; bIdx < backstitchesToRemove.length; bIdx++) {
      let b = backstitchesToRemove[bIdx];
      let idx = this.backstitches.findIndex(b2 => b2.id == b.id);
      this.backstitches.splice(idx, 1);
    }

    return backstitchesToRemove.length;
  }

  // TODO: set partial stitch

  drawCrossstitchLayer(ctx: CanvasRenderingContext2D, palette: PaletteEntry[]): void {
    // Cross stitches
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

  drawBackstitchLayer(ctx: CanvasRenderingContext2D, palette: PaletteEntry[]): void {
    // Back stitches
    ctx.lineWidth = 4;
    for (let bIdx = 0; bIdx < this.backstitches.length; bIdx++) {
      let backstitch = this.backstitches[bIdx];

      ctx.strokeStyle = palette[backstitch.paletteIdx].floss.colour;
      
      // is this the most efficient way to do this? group by colour maybe?
      ctx.beginPath();
      ctx.moveTo(backstitch.startX, backstitch.startY);
      ctx.lineTo(backstitch.endX, backstitch.endY);
      ctx.stroke();
    }
  }

}