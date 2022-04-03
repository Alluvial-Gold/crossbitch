import { Injectable, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { FabricPoint } from 'src/app/canvas/canvas/canvas.component';
import { BackstitchLine, BasicLayer } from 'src/app/core/state/basic-layer.model';
import { Project } from 'src/app/core/state/project.actions';
import { ProjectModel } from 'src/app/core/state/project.model';
import { ProjectState } from 'src/app/core/state/project.state';
import { IToolService } from '../interfaces/i-tool.interface';

export enum DrawServiceMode {
  CrossStitch,
  Backstitch
};

@Injectable({
  providedIn: 'root'
})
export class DrawService implements IToolService, OnDestroy {

  sub: Subscription = new Subscription();

  @Select(ProjectState.getProject)
  project$!: Observable<ProjectModel>;
  project: ProjectModel | undefined;

  currentMode: DrawServiceMode = DrawServiceMode.CrossStitch;
  private isDrawDragging = false;
  private lineId = 0;
  private currentLine: BackstitchLine | undefined;

  constructor(
    private store: Store,
  ) {
    this.sub.add(
      this.project$.subscribe((project) => {
        this.project = project;
      })
    );
   }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  setCurrentMode(mode: DrawServiceMode) {
    this.currentMode = mode;
  }

  onMouseDown(point: FabricPoint) {
    if (this.currentMode === DrawServiceMode.CrossStitch) {
      this.colourSquare(point);
      this.isDrawDragging = true;
    } else if (this.currentMode === DrawServiceMode.Backstitch) {
      this.startDrawingLine(point);
      this.isDrawDragging = true;
    }
  }

  onMouseMove(point: FabricPoint): void {
    if (this.currentMode === DrawServiceMode.CrossStitch) {
      if (this.isDrawDragging) {
        this.colourSquare(point);
      }
    } else if (this.currentMode === DrawServiceMode.Backstitch) {
      if (this.isDrawDragging) {
        this.updateLine(point);
      }
    }
  }

  onMouseUp(): void {
    this.isDrawDragging = false;
    this.currentLine = undefined;
  }

  // Cross stitch functions

  private colourSquare(point: FabricPoint) {
    let squareX = Math.floor(point.x);
    let squareY = Math.floor(point.y);
    if (!this.project || squareX < 0 || squareX >= this.project.fabricSettings.columns ||
        squareY < 0 || squareY >= this.project.fabricSettings.rows ) {
      return;
    }

    let currentLayer = this.project.layers[this.project.currentLayerIndex];
    if (currentLayer instanceof BasicLayer) {
      let currentValue = currentLayer.crossstitches[squareY][squareX];

      // Check if current square is already filled with current colour
      let index = this.project.currentPaletteColourIndex;
      if (currentValue != index) {
        this.store.dispatch(new Project.FillSquare(squareY, squareX, index));
      }
    }
  }

  // Back stitch functions
  private startDrawingLine(point: FabricPoint) {
    this.lineId++;

    // Round value to closest point
    let roundPoint: FabricPoint = {
      x: Math.round(point.x),
      y: Math.round(point.y)
    };

    // Check that it's in bounds
    // NOTE: points, so can be equal to columns/rows
    if (!this.project || roundPoint.x < 0 || roundPoint.x > this.project.fabricSettings.columns ||
        roundPoint.y < 0 || roundPoint.y > this.project.fabricSettings.rows ) {
      return;
    }

    let startX = roundPoint.x;
    let startY = roundPoint.y;
    let index =  this.project.currentPaletteColourIndex;

    this.currentLine = {
      id: this.lineId.toString(),
      startX: startX,
      startY: startY,
      endX: startX,
      endY: startY,
      paletteIdx: index,
    };

    this.store.dispatch(new Project.DrawLine(this.currentLine))
  }

    private updateLine(point: FabricPoint) {
    // assume that this is updating current line
    if (!this.project || !this.currentLine) {
      return;
    }

    // Round value to closest point
    let roundPoint: FabricPoint = {
      x: Math.round(point.x),
      y: Math.round(point.y)
    };

    // TODO... deal with pointer off of fabric
    if (roundPoint.x < 0 || roundPoint.x > this.project.fabricSettings.columns ||
        roundPoint.y < 0 || roundPoint.y > this.project.fabricSettings.rows ) {
      return;
    }

    this.currentLine.endX = roundPoint.x;
    this.currentLine.endY = roundPoint.y;

    this.store.dispatch(new Project.UpdateLine(this.currentLine))
  }
}
