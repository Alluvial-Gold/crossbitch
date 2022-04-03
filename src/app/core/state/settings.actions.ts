import { IToolService } from "src/app/toolbox/interfaces/itool.service.interface";

export namespace Settings {

  export class SelectTool {
    static readonly type = '[Settings] SelectTool';
    constructor(public service: IToolService) {};
  }

}