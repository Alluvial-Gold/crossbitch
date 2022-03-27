import { Tools } from "src/app/toolbox/interfaces/tool.interface";
import { ToolboxModes } from "src/app/toolbox/interfaces/toolbox-mode.interface";

export interface SettingsModel {

  currentToolboxMode: ToolboxModes;

  currentTool: Tools;

}