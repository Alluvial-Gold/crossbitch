import { ToolboxMode } from "./settings.model";

export namespace Settings {

  export class SelectToolboxMode {
    static readonly type = '[Settings] SelectToolboxMode';
    constructor(public mode: ToolboxMode) {};
  }

}