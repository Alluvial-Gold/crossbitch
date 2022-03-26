export namespace Project {

  // Create project
  export class CreateProject {
    static readonly type = '[Project] CreateProject';
    constructor(public rows: number, public columns: number) {}
  }

  // Get project

  // Update project palette

  // Get project palette

  // Add layer

  // Get layers

  // Draw on layer
  export class FillSquare {
    static readonly type = '[Project] FillSquare';
    constructor(public row: number, public column: number) {}
  }
}