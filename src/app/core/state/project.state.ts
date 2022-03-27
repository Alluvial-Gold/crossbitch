import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, StateToken } from "@ngxs/store";
import { CanvasSettings } from "./canvas-settings.model";
import { ILayer } from "./ilayer.interface";
import { PaletteEntry } from "./palette-entry.model";
import { BackstitchLine, BasicLayer } from "./basic-layer.model";
import { Project } from "./project.actions";
import { ProjectModel } from "./project.model";
import { DMCFlossList } from "src/assets/DMCFlossList";

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

  @Selector([PROJECT_STATE_TOKEN])
  static getCurrentColour(state: ProjectModel): PaletteEntry {
    return state.palette[state.currentPaletteColourIndex];
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

    // Start with single layer
    let layer = new BasicLayer("Base", action.rows, action.columns);
    let layers = [layer];

    // Sample palette
    let dmcColours = ["552", "553", "209", "164", "989"];
    let samplePalette: PaletteEntry[] = dmcColours.map((c) => {
      let floss = DMCFlossList.find((f) => f.number == c);
      return {
        floss: {
          description: floss ? `DMC ${floss.number} ${floss.name}` : '???',
          colour: floss ? floss.hex : '#000000'
        },
        symbol: { value: 'a' },
        strands: 2
      }
    });

    ctx.patchState({
      canvasSettings: settings,
      layers: layers,
      currentLayerIndex: 0,
      palette: samplePalette,
      currentPaletteColourIndex: 0
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

  @Action(Project.UpdateCurrentPaletteEntry)
  updateCurrentPaletteEntry(
    ctx: StateContext<ProjectModel>,
    action: Project.UpdateCurrentPaletteEntry
  ) {
    let state = ctx.getState();

    let newPalette = state.palette;
    newPalette[state.currentPaletteColourIndex] = action.paletteEntry;

    ctx.patchState({
      palette: newPalette
    });
  }

  @Action(Project.SelectPaletteColour)
  selectPaletteColour(
    ctx: StateContext<ProjectModel>,
    action: Project.SelectPaletteColour
  ) {
    let state = ctx.getState();

    let selectedColourIndex = state.palette.findIndex((c) => c === action.paletteEntry);
    if (selectedColourIndex != -1) {
      ctx.patchState({
        currentPaletteColourIndex: selectedColourIndex
      })
    }
  }

  @Action(Project.FillSquare)
  fillSquare(
    ctx: StateContext<ProjectModel>,
    action: Project.FillSquare
  ) {
    // If current layer is basic layer, fill square
    let state = ctx.getState();
    let currentLayer = state.layers[state.currentLayerIndex];

    if (currentLayer instanceof BasicLayer) {
      currentLayer.setFullStitch(action.index, action.row, action.column);

      // TODO: figure out a nicer way to do this
      let newLayers = state.layers;
      newLayers[state.currentLayerIndex] = currentLayer;
      ctx.patchState({
        layers: newLayers
      });
    }
  }

  @Action(Project.DrawLine)
  drawLine(
    ctx: StateContext<ProjectModel>,
    action: Project.DrawLine
  ) {
    // If current layer is basic layer, draw line
    let state = ctx.getState();
    let currentLayer = state.layers[state.currentLayerIndex];
    
    if (currentLayer instanceof BasicLayer) {
      currentLayer.addBackStitch(action.line);

      // TODO: figure out a nicer way to do this
      let newLayers = state.layers;
      newLayers[state.currentLayerIndex] = currentLayer;
      ctx.patchState({
        layers: newLayers
      });
    }
  }

  @Action(Project.UpdateLine)
  updateLine(
    ctx: StateContext<ProjectModel>,
    action: Project.UpdateLine
  ) {
    // If current layer is basic layer, draw line
    let state = ctx.getState();
    let currentLayer = state.layers[state.currentLayerIndex];
    
    if (currentLayer instanceof BasicLayer) {
      currentLayer.updateBackStitch(action.line);

      // TODO: figure out a nicer way to do this
      let newLayers = state.layers;
      newLayers[state.currentLayerIndex] = currentLayer;
      ctx.patchState({
        layers: newLayers
      });
    }
  }
}