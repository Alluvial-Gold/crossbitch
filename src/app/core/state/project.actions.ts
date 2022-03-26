export namespace Project {

  export class CreateProject {
    static readonly type = '[Project] CreateProject';
    constructor(public rows: number, public columns: number) {}
  }

  // Update project palette

  // Add layer

  // Delete layer

  export class SelectLayer {
    static readonly type = '[Project] SelectLayer';
    constructor(public layerName: string) {}
  }

  export class FillSquare {
    static readonly type = '[Project] FillSquare';
    constructor(public row: number, public column: number, public index: number) {}
  }

  // Draw backstitch line
}