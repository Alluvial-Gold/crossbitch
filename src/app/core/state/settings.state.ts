import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, StateToken } from "@ngxs/store";
import { Tools } from "src/app/toolbox/interfaces/tool.interface";
import { ToolboxModes } from "src/app/toolbox/interfaces/toolbox-mode.interface";
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
  static getCurrentToolboxMode(state: SettingsModel): ToolboxModes {
    return state.currentToolboxMode;
  }

  @Selector([SETTINGS_STATE_TOKEN])
  static getCurrentTool(state: SettingsModel): Tools {
    return state.currentTool;
  }

  @Action(Settings.SelectToolboxMode)
  selectToolboxMode(
    ctx: StateContext<SettingsModel>,
    action: Settings.SelectToolboxMode
  ) {
    ctx.patchState({
      currentToolboxMode: action.mode
    })
  }

  @Action(Settings.SelectTool)
  selectTool(
    ctx: StateContext<SettingsModel>,
    action: Settings.SelectTool
  ) {
    ctx.patchState({
      currentTool: action.tool
    })
  }
}