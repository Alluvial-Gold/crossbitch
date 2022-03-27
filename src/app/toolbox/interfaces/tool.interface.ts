import { ToolboxModes } from "./toolbox-mode.interface";

export enum Tools {
  Draw,
  Erase,
}

export interface Tool {
  tool: Tools;
  name: string;
  icon: string;
  validModes: ToolboxModes[];
}
