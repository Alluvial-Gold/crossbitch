import { Injectable, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { FabricPoint } from 'src/app/canvas/canvas/canvas.component';
import { BasicLayer } from 'src/app/core/state/basic-layer.model';
import { Project } from 'src/app/core/state/project.actions';
import { ProjectModel } from 'src/app/core/state/project.model';
import { ProjectState } from 'src/app/core/state/project.state';
import { IToolService } from '../interfaces/i-tool.interface';

export enum EraseServiceMode {
  CrossStitch,
  Backstitch
};


@Injectable({
  providedIn: 'root'
})
export class EraseService implements IToolService, OnDestroy {

  sub: Subscription = new Subscription();

  @Select(ProjectState.getProject)
  project$!: Observable<ProjectModel>;
  project: ProjectModel | undefined;

  currentMode: EraseServiceMode = EraseServiceMode.CrossStitch;
  isDrawDragging = false;

  constructor(
    private store: Store
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

  setCurrentMode(mode: EraseServiceMode) {
    this.currentMode = mode;
  }

  onMouseDown(point: FabricPoint): void {
    if (this.currentMode === EraseServiceMode.CrossStitch) {
      this.eraseSquare(point);
      this.isDrawDragging = true;
    } else if (this.currentMode === EraseServiceMode.Backstitch) {
      this.removeLine(point);
    }
  }

  onMouseMove(point: FabricPoint): void {
    if (this.currentMode === EraseServiceMode.CrossStitch) {
      if (this.isDrawDragging) {
        this.eraseSquare(point);
      }
    }
  }
  onMouseUp(): void {
    this.isDrawDragging = false;
  }

  // Cross stitch

  private eraseSquare(point: FabricPoint) {
    let squareX = Math.floor(point.x);
    let squareY = Math.floor(point.y);
    if (!this.project || squareX < 0 || squareX >= this.project.fabricSettings.columns ||
        squareY < 0 || squareY >= this.project.fabricSettings.rows ) {
      return;
    }

    let currentLayer = this.project.layers[this.project.currentLayerIndex];
    if (currentLayer instanceof BasicLayer) {
      let currentValue = currentLayer.crossstitches[squareY][squareX];

      // Check if current square is already empty
      let index = -1;
      if (currentValue != index) {
        this.store.dispatch(new Project.FillSquare(squareY, squareX, index));
      }
    }
  }

  // Back stitch

  private removeLine(point: FabricPoint) {
    if (!this.project) {
      return;
    }

    if (!this.project || point.x < 0 || point.x > this.project.fabricSettings.columns ||
      point.y < 0 || point.y > this.project.fabricSettings.rows ) {
      return;
    }
    // TODO fix tolerance
    this.store.dispatch(new Project.RemoveLine(point.x, point.y))
  }
}
