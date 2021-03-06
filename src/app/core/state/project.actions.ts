import { BackstitchLine } from "./basic-layer.model";
import { PaletteEntry } from "./palette-entry.model";
import { ProjectModel } from "./project.model";

export namespace Project {

  export class CreateProject {
    static readonly type = '[Project] CreateProject';
    constructor(public name: string, public colour: string, public rows: number, public columns: number) {}
  }

  export class ImportProject {
    static readonly type = '[Project] ImportProject';
    constructor(public project: ProjectModel) {}
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

  export class UpdateCurrentPaletteEntry {
    static readonly type = '[Project] UpdateCurrentPaletteEntry';
    constructor(public paletteEntry: PaletteEntry) {}
  }

  export class DeletePaletteEntry {
    static readonly type = '[Project] DeletePaletteEntry';
    constructor(public indexToRemove: number, public replaceIndex: number) {}
  }

  export class SelectPaletteColour {
    static readonly type = '[Project] SelectPaletteColour';
    constructor(public paletteEntry: PaletteEntry) {}
  }


  export class FillSquare {
    static readonly type = '[Project] FillSquare';
    constructor(public row: number, public column: number, public index: number) {}
  }

  export class DrawLine {
    static readonly type = '[Project] DrawLine';
    constructor(public line: BackstitchLine) {}
  }

  export class UpdateLine {
    static readonly type = '[Project] UpdateLine';
    constructor(public line: BackstitchLine) {}
  }

  export class RemoveLine {
    static readonly type = '[Project] RemoveLine';
    constructor(public clickedX: number, public clickedY: number) {}
  }

}