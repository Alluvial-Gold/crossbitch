import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, StateToken } from "@ngxs/store";
import { IToolService } from "src/app/toolbox/interfaces/itool.service.interface";
import { Settings } from "./settings.actions";
import { SettingsModel } from "./settings.model";

const SETTINGS_STATE_TOKEN = new StateToken<SettingsModel>('settings');

@State<SettingsModel>({
  name: SETTINGS_STATE_TOKEN
})
@Injectable()
export class SettingsState {

  constructor() {

  }

  @Selector([SETTINGS_STATE_TOKEN])
  static getSettings(state: SettingsModel): SettingsModel {
    return state;
  }

  @Selector([SETTINGS_STATE_TOKEN])
  static getCurrentTool(state: SettingsModel): IToolService {
    return state.currentTool;
  }

  @Action(Settings.SelectTool)
  selectTool(
    ctx: StateContext<SettingsModel>,
    action: Settings.SelectTool
  ) {
    ctx.patchState({
      currentTool: action.service
    })
  }
}