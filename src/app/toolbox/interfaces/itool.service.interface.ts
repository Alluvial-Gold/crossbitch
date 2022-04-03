import { FabricPoint } from "src/app/shared/interfaces/fabric-point.interface";

/**
 * Interface for tool services
 */
export interface IToolService {

  onMouseDown(point: FabricPoint): void;

  onMouseMove(point: FabricPoint): void;

  onMouseUp(): void;

}