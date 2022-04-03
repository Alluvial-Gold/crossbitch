import { FabricPoint } from "src/app/canvas/canvas/canvas.component";

// Abstract class for tool services
export interface IToolService {

  onMouseDown(point: FabricPoint): void;

  onMouseMove(point: FabricPoint): void;

  onMouseUp(): void;

}