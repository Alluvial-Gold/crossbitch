/**
 * Settings that apply to the whole canvas
 */
 export class CanvasSettings {
  
  private _rows: number = 20;
  private _columns: number = 20;
  private _backgroundColour: string

  constructor(rows: number, columns: number, backgroundColour: string) {
    this.rows = rows;
    this.columns = columns;
    this._backgroundColour = backgroundColour;
  }

  get rows(): number {
    return this._rows;
  }

  set rows(newRows: number) {
    if (newRows <= 0 || !Number.isInteger(newRows)) {
      throw new Error("Invalid row value!");
    }
    this._rows = newRows;
  }

  get columns(): number {
    return this._columns;
  }

  set columns(newColumns: number) {
    if (newColumns <= 0 || !Number.isInteger(newColumns)) {
      throw new Error("Invalid column value!");
    }
    this._columns = newColumns;
  }

  
  get backgroundColour() : string {
    return this._backgroundColour;
  }
  
  set backgroundColour(newBackgroundColour: string) {
    // TODO check that this is a valid colour
    this._backgroundColour = newBackgroundColour;
  }


}