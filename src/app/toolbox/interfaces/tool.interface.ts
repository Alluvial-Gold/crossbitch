import { IToolService } from "./i-tool.interface";

export interface Tool {
  name: string;
  icon: string;
  service: IToolService;
}
