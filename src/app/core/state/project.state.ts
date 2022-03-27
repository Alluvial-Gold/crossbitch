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
import { BackStitchLayer } from "./backstitch-layer.model";

const PROJECT_STATE_TOKEN = new StateToken<ProjectModel>('project');

@State<ProjectModel>({
  name: PROJECT_STATE_TOKEN
})
@Injectable()
export class ProjectState {

  constructor() {
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
  static getCurrentLayer(state: ProjectModel): ILayer {
    return state.layers[state.currentLayerIndex];
  }

  @Selector([PROJECT_STATE_TOKEN])
  static getPalette(state: ProjectModel): PaletteEntry[] {
    return [...state.palette];
  }

  @Action(Project.CreateProject)
  createProject(
    ctx: StateContext<ProjectModel>,
    action: Project.CreateProject
  ) {
    
    let settings: CanvasSettings = {
      rows: action.rows,
      columns: action.columns,
      backgroundColour: 'white' 
    };

    // Start with single SquareLayer & Backstitch layer
    let layer1 = new SquareLayer("Square1", action.rows, action.columns);
    let layer2 = new BackStitchLayer("Backstitch1");
    let layers = [layer1, layer2];

    // Start with black
    let blackFloss: Floss = {
      description: "Default black",
      colour: "#000000",
    };
    let blackFlossSymbol: PatternSymbol = {
      value: "a"
    };
    let palette: PaletteEntry[] = [
      {
        floss: blackFloss,
        strands: 2,
        symbol: blackFlossSymbol
      }
    ];

    ctx.patchState({
      canvasSettings: settings,
      layers: layers,
      currentLayerIndex: 0,
      palette: palette
    });

  }


  @Action(Project.SelectLayer)
  selectLayer(
    ctx: StateContext<ProjectModel>,
    action: Project.SelectLayer
  ) {
    let state = ctx.getState();
    let newIdx = state.layers.findIndex((layer) => layer.name == action.layerName);
    if (newIdx != -1) {
      ctx.patchState({
        currentLayerIndex: newIdx
      });
    }
  }

  @Action(Project.AddPaletteEntry)
  addPaletteEntry(
    ctx: StateContext<ProjectModel>,
    action: Project.AddPaletteEntry
  ) {
    let state = ctx.getState();

    let newPalette = state.palette;
    newPalette.push(action.paletteEntry);

    ctx.patchState({
      palette: newPalette
    });
  }


  // Should this be here or somewhere else?
  @Action(Project.FillSquare)
  fillSquare(
    ctx: StateContext<ProjectModel>,
    action: Project.FillSquare
  ) {
    // If current layer is square layer, fill square
    let state = ctx.getState();
    let currentLayer = state.layers[state.currentLayerIndex];

    if (currentLayer instanceof SquareLayer) {
      currentLayer.values[action.row][action.column] = action.index;

      // TODO: figure out a nicer way to do this
      let newLayers = state.layers;
      newLayers[state.currentLayerIndex] = currentLayer;
      ctx.patchState({
        layers: newLayers
      });
    }
  }
}