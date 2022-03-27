import { Tools } from "src/app/toolbox/interfaces/tool.interface";
import { ToolboxModes } from "src/app/toolbox/interfaces/toolbox-mode.interface";

export namespace Settings {

  export class SelectToolboxMode {
    static readonly type = '[Settings] SelectToolboxMode';
    constructor(public mode: ToolboxModes) {};
  }

  export class SelectTool {
    static readonly type = '[Settings] SelectTool';
    constructor(public tool: Tools) {}
  }

}