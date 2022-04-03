import { IToolService } from "./itool.service.interface";

export interface Tool {
  name: string;
  icon: string;
  service: IToolService;
}
