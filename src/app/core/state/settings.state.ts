import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, StateToken } from "@ngxs/store";
import { Settings } from "./settings.actions";
import { SettingsModel, ToolboxMode } from "./settings.model";

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
  static getCurrentToolboxMode(state: SettingsModel): ToolboxMode {
    return state.currentToolboxMode;
  }

  @Action(Settings.SelectToolboxMode)
  selectToolboxMode(
    ctx: StateContext<SettingsModel>,
    action: Settings.SelectToolboxMode
  ) {
    console.log('change toolbox mode');
    ctx.patchState({
      currentToolboxMode: action.mode
    })
  }
}