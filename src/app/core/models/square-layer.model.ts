import { ILayer } from "./ilayer.interface";

export class SquareLayer implements ILayer {

  name: string;

  rows: number;
  columns: number

  constructor(newName: string, newRows: number, newColumns: number) {
    this.name = newName;

    this.rows = newRows;
    this.columns = newColumns;
  }

  drawLayer(ctx: CanvasRenderingContext2D): void {


    // TODO
  }

}