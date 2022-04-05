import { Injectable } from '@angular/core';
import { SQUARE_SIZE } from '../constants';
import { BackstitchLine, BasicLayer } from '../state/basic-layer.model';
import { PaletteEntry } from '../state/palette-entry.model';

@Injectable({
  providedIn: 'root'
})
export class BasicLayerService {

  constructor() { }

  createEmptyLayer(name: string, rows: number, columns: number): BasicLayer {

    let crossStitches: number[][] = []

    // Set up values
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
      let row: number[] = []
      for (let colIdx = 0; colIdx < columns; colIdx++) {
        row.push(-1);
      }
      crossStitches.push(row);
    }

    let newLayer: BasicLayer = {
      name: name,
      crossstitches: crossStitches,
      backstitches: []
    };
    return newLayer;
  }

  setFullStitch(layer: BasicLayer, paletteIdx: number, rowIdx: number, columnIdx: number): void {
    layer.crossstitches[rowIdx][columnIdx] = paletteIdx;
  }

  addBackStitch(layer: BasicLayer, newBackstitch: BackstitchLine): void {
    layer.backstitches.push(newBackstitch);
  }

  updateBackStitch(layer: BasicLayer, updatedBackstitch: BackstitchLine): void {
    let backstitch = layer.backstitches.find(b => b.id == updatedBackstitch.id);
    if (backstitch) {
      backstitch = {
        ...updatedBackstitch
      }
    }
  }

  removeBackstitch(layer: BasicLayer, clickedX: number, clickedY: number): number {
    let backstitchesToRemove = layer.backstitches.filter(b => {
      let lowX = Math.min(b.startX, b.endX) - 0.5;
      let highX = Math.max(b.startX, b.endX) + 0.5;
      let lowY = Math.min(b.startY, b.endY) - 0.5;
      let highY = Math.max(b.startY, b.endY) + 0.5;

      if (lowX < clickedX && clickedX < highX &&
          lowY < clickedY && clickedY < highY) {
          // Check distance...
          let numerator = Math.abs((b.endX - b.startX) * (b.startY - clickedY) - (b.startX - clickedX) * (b.endY - b.startY));
          let denominator = Math.sqrt(Math.pow(b.endX - b.startX, 2) + Math.pow(b.endY - b.startY, 2));
          let distance = numerator / denominator;
          return distance < 0.5;
      }
  
      return false;
    });
  
    for (let bIdx = 0; bIdx < backstitchesToRemove.length; bIdx++) {
      let b = backstitchesToRemove[bIdx];
      let idx = layer.backstitches.findIndex(b2 => b2.id == b.id);
      layer.backstitches.splice(idx, 1);
    }
  
    return backstitchesToRemove.length;
  }

  updatePalette(layer: BasicLayer, paletteMap: Map<number, number>) {
    // cross stitch
    for (let rowIdx = 0; rowIdx < layer.crossstitches.length; rowIdx++) {
      for (let colIdx = 0; colIdx < layer.crossstitches[0].length; colIdx++) {
        let value = layer.crossstitches[rowIdx][colIdx];
  
        if (value != -1) {
          if (typeof value === 'number') {
            layer.crossstitches[rowIdx][colIdx] = paletteMap.get(value)!;
          } else {
            // TODO - partial square
            for (let valIdx = 0; valIdx < value.length; valIdx++) {
              let val2 = value[valIdx];
              (layer.crossstitches[rowIdx][colIdx] as number[])[valIdx] = paletteMap.get(val2)!;
            }
          }
        }
      }
    }
  
    // backstitch
    layer.backstitches = layer.backstitches.map(b => {
      b.paletteIdx = paletteMap.get(b.paletteIdx)!;
      return b;
    }).filter(b => b.paletteIdx != -1);
  }

  drawCrossstitchLayer(layer: BasicLayer, ctx: CanvasRenderingContext2D, palette: PaletteEntry[]): void {
    // Cross stitches
    for (let rowIdx = 0; rowIdx < layer.crossstitches.length; rowIdx++) {
      for (let colIdx = 0; colIdx < layer.crossstitches[0].length; colIdx++) {
        let value = layer.crossstitches[rowIdx][colIdx];
  
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
  
  drawBackstitchLayer(layer: BasicLayer, ctx: CanvasRenderingContext2D, palette: PaletteEntry[]): void {
    // Back stitches
    ctx.lineWidth = 4;
    for (let bIdx = 0; bIdx < layer.backstitches.length; bIdx++) {
      let backstitch = layer.backstitches[bIdx];
  
      ctx.strokeStyle = palette[backstitch.paletteIdx].floss.colour;
      
      // is this the most efficient way to do this? group by colour maybe?
      ctx.beginPath();
      ctx.moveTo(backstitch.startX * SQUARE_SIZE, backstitch.startY * SQUARE_SIZE);
      ctx.lineTo(backstitch.endX * SQUARE_SIZE, backstitch.endY * SQUARE_SIZE);
      ctx.stroke();
    }
  }
  
}
