import { PaletteEntry } from "./palette-entry.model";

export namespace Project {

  export class CreateProject {
    static readonly type = '[Project] CreateProject';
    constructor(public rows: number, public columns: number) {}
  }

  // Add layer

  // Delete layer

  export class SelectLayer {
    static readonly type = '[Project] SelectLayer';
    constructor(public layerName: string) {}
  }
  
  export class AddPaletteEntry {
    static readonly type = '[Project] AddPaletteEntry';
    constructor(public paletteEntry: PaletteEntry) {}
  }

  export class SelectPaletteColour {
    static readonly type = '[Project] SelectPaletteColour';
    constructor(public paletteEntry: PaletteEntry) {}
  }


  export class FillSquare {
    static readonly type = '[Project] FillSquare';
    constructor(public row: number, public column: number, public index: number) {}
  }

  // Draw backstitch line


}