
export enum ToolboxModes {
  Crossstitch,
  Backstitch
};

export interface ToolboxMode {
  mode: ToolboxModes;
  name: string;
  icon: string;
};