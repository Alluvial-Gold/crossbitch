// Generic layer...?
export interface ILayer {

  // Name of the layer
  name: string;

  // Function for drawing the layer onto the canvas
  drawLayer(ctx: CanvasRenderingContext2D): void;

  // TODO - export to project file function

}