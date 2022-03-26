import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, StateToken } from "@ngxs/store";
import { CanvasSettings } from "./canvas-settings.model";
import { Floss } from "./floss.model";
import { ILayer } from "./ilayer.interface";
import { PaletteEntry } from "./palette-entry.model";
import { PatternSymbol } from "./pattern-symbol.model";
import { SquareLayer } from "./square-layer.model";
import { Project } from "./project.actions";
import { ProjectModel } from "./project.model";

const PROJECT_STATE_TOKEN = new StateToken<ProjectModel>('project');

// TODO default state

@State<ProjectModel>({
  name: PROJECT_STATE_TOKEN
})
@Injectable()
export class ProjectState {

  constructor() {
    // TODO
  }

  @Selector([PROJECT_STATE_TOKEN])
  static getProject(state: ProjectModel): ProjectModel {
    return state;
  }

  @Selector([PROJECT_STATE_TOKEN])
  static getLayers(state: ProjectModel): ILayer[] {
    return state.layers;
  }

  @Selector([PROJECT_STATE_TOKEN])
  static getPalette(state: ProjectModel): PaletteEntry[] {
    return state.palette;
  }

  @Action(Project.CreateProject)
  createProject(
    ctx: StateContext<ProjectModel>,
    action: Project.CreateProject
  ) {
    
    let settings: CanvasSettings = new CanvasSettings(action.rows, action.columns, 'white');

    // Start with single SquareLayer
    let layer1 = new SquareLayer("Square1", action.rows, action.columns);
    let layers = [layer1];

    // Start with black
    let blackFloss = new Floss("Default black", "#000000");
    let blackFlossSymbol = new PatternSymbol("a");
    let palette = [new PaletteEntry(blackFlossSymbol, blackFloss)];

    ctx.patchState({
      canvasSettings: settings,
      layers: layers,
      palette: palette
    });

  }

}