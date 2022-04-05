import { ILayer } from "./ilayer.interface";

// TODO move
export interface BackstitchLine {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  paletteIdx: number;
}

export interface BasicLayer extends ILayer {

  name: string;

  // -1 = nothing
  // 0+ = palette :)
  // multiple numbers: partial stitches
  crossstitches: (number | number[])[][];

  backstitches: BackstitchLine[];

}