import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SQUARE_SIZE } from 'src/app/core/constants';
import { Project } from 'src/app/core/state/project.actions';
import { ProjectModel } from 'src/app/core/state/project.model';
import { ProjectState } from 'src/app/core/state/project.state';
import { SettingsState } from 'src/app/core/state/settings.state';
import { BackstitchLine, BasicLayer } from 'src/app/core/state/basic-layer.model';
import { ToolboxModes } from 'src/app/toolbox/interfaces/toolbox-mode.interface';
import { Tools } from 'src/app/toolbox/interfaces/tool.interface';
import { filter } from 'rxjs/operators';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;
const ZOOM_INC = 0.1;

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy {

  sub: Subscription = new Subscription();

  @Select(ProjectState.getProject)
  project$!: Observable<ProjectModel>;
  project: ProjectModel | undefined;

  @Select(SettingsState.getCurrentToolboxMode)
  currentMode$!: Observable<ToolboxModes>;
  currentMode: ToolboxModes | undefined;

  @Select(SettingsState.getCurrentTool)
  currentTool$!: Observable<Tools>;
  currentTool: Tools | undefined;

  @ViewChild('mainCanvas', {static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case ' ':
        this.zoomToFit()
        break;
      default:
        break;
    }
  }

  private ctx!: CanvasRenderingContext2D;

  // Transform...
  private zoomFactor = 1;
  private transformX = 0;
  private transformY = 0;
  private isPanDragging = false;
  private isDrawDragging = false;

  private lineId = 0;
  private currentLine: BackstitchLine | undefined;

  private gridPattern!: CanvasPattern;

  constructor(
    private store: Store,
  ) {}

  ngOnInit(): void {
    let ctx = this.canvas?.nativeElement.getContext('2d');
    if (ctx) {
      this.ctx = ctx;
    }

    var img = new Image();
    img.src = '../../assets/gridpattern.png';
    img.onload = () => {
      var pattern = this.ctx.createPattern(img, 'repeat');
      if (pattern) {
        this.gridPattern = pattern;
        this.redraw();
      }
    }
    
    this.sub.add(
      this.project$
        .pipe(
          filter(x => Object.keys(x).length > 0) // ignore if empty
        )
        .subscribe((project) => {
          let zoom = !this.project;

          this.project = project;
          this.redraw();

          // todo - improve
          // zoom to fit when new project is loaded
          if (zoom) {
            this.zoomToFit();
          }
          
      })
    )

    this.sub.add(
      this.currentMode$.subscribe((currentMode) => {
        this.currentMode = currentMode;
      })
    );

    this.sub.add(
      this.currentTool$.subscribe((currentTool) => {
        this.currentTool = currentTool;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    // Set height
    if (this.canvas) {
      this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
      this.canvas.nativeElement.height =  this.canvas.nativeElement.offsetHeight;
    }

    this.redraw();
    this.zoomToFit();
  }

  clear() {
    let margin = 10;

    let clearX = -(this.transformX / this.zoomFactor) - margin;
    let clearY = -(this.transformY / this.zoomFactor) - margin;

    let clearWidth = 2 * margin + this.ctx.canvas.width / this.zoomFactor;
    let clearHeight = 2 * margin + this.ctx.canvas.height /this.zoomFactor;

    this.ctx.clearRect(clearX, clearY, clearWidth, clearHeight);
  }

  redraw() {
    if (!this.project) {
      return;
    }

    this.clear();

    let width = this.project.canvasSettings.columns * SQUARE_SIZE;
    let height = this.project.canvasSettings.rows * SQUARE_SIZE;

    // 1. Draw background
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, width, height);

    // 2. Draw cross stitch layers
    for (let layerIdx = 0; layerIdx < this.project.layers.length; layerIdx++) {
      this.project.layers[layerIdx].drawCrossstitchLayer(this.ctx, this.project.palette);
    }

    // 3. Draw lines on top
    this.drawGridLines(width, height);

    // 4. Draw back stitch layers
    for (let layerIdx = 0; layerIdx < this.project.layers.length; layerIdx++) {
      this.project.layers[layerIdx].drawBackstitchLayer(this.ctx, this.project.palette);
    }

    // 5.  Draw text for lines outside of box
    // TODO - later

    // 6. Draw center line - later
  }

  private drawGridLines(width: number, height: number) {
    this.ctx.fillStyle = this.gridPattern;
    this.ctx.fillRect(0, 0, width, height);
  }

  private getSquare(mouseX: number, mouseY: number): Point | null {
    let xInCanvas = mouseX - this.transformX;
    let yInCanvas = mouseY - this.transformY;
    let xValue = Math.floor(xInCanvas / (SQUARE_SIZE * this.zoomFactor));
    let yValue = Math.floor(yInCanvas / (SQUARE_SIZE * this.zoomFactor));

    if (this.project && 
        xValue >= 0 && xValue < this.project.canvasSettings.columns && 
        yValue >= 0 && yValue < this.project.canvasSettings.rows) {
      return { x: xValue, y: yValue };
    }
    return null;
  }

  private getSquare_Round(mouseX: number, mouseY: number): Point | null {
    let xInCanvas = mouseX - this.transformX;
    let yInCanvas = mouseY - this.transformY;
    let xValue = Math.round(xInCanvas / (SQUARE_SIZE * this.zoomFactor));
    let yValue = Math.round(yInCanvas / (SQUARE_SIZE * this.zoomFactor));

    if (this.project && 
        xValue >= 0 && xValue < this.project.canvasSettings.columns && 
        yValue >= 0 && yValue < this.project.canvasSettings.rows) {
      return { x: xValue, y: yValue };
    }
    return null;
  }

  // like get square, but no rounding/flooring
  private getCanvasPoint(mouseX: number, mouseY: number): Point | null {
    let xInCanvas = mouseX - this.transformX;
    let yInCanvas = mouseY - this.transformY;
    let xValue = xInCanvas / (SQUARE_SIZE * this.zoomFactor);
    let yValue = yInCanvas / (SQUARE_SIZE * this.zoomFactor);

    if (this.project && 
        xValue >= 0 && xValue < this.project.canvasSettings.columns && 
        yValue >= 0 && yValue < this.project.canvasSettings.rows) {
      return { x: xValue, y: yValue };
    }
    return null;
  }

  private colourSquare(mouseX: number, mouseY: number, remove: boolean = false) {
    if (!this.project) {
      return;
    }

    let squareValue = this.getSquare(mouseX, mouseY);
    if (!squareValue) {
      return;
    }

    let currentLayer = this.project.layers[this.project.currentLayerIndex];
    if (currentLayer instanceof BasicLayer) {
      let currentValue = currentLayer.crossstitches[squareValue.y][squareValue.x];

      // Check if current square is already filled with current colour
      let index = remove ? -1 : this.project.currentPaletteColourIndex;
      if (currentValue != index) {
        this.store.dispatch(new Project.FillSquare(squareValue.y, squareValue.x, index));
      }
    }
  }

  private startDrawingLine(mouseX: number, mouseY: number) {
    if (!this.project) {
      return;
    }

    this.lineId++;

    let squareValue = this.getSquare_Round(mouseX, mouseY);
    if (squareValue) {
      let startX = squareValue.x;
      let startY = squareValue.y;
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
  }

  private updateLine(mouseX: number, mouseY: number) {
    // assume that this is updating current line
    if (!this.project || !this.currentLine) {
      return;
    }

    let squareValue = this.getSquare_Round(mouseX, mouseY);
    if (squareValue) {
      let endX = squareValue.x;
      let endY = squareValue.y;


      this.currentLine.endX = endX;
      this.currentLine.endY = endY;

      this.store.dispatch(new Project.UpdateLine(this.currentLine))
    }
  }

  private removeLine(mouseX: number, mouseY: number) {

    if (!this.project) {
      return;
    }

    let squareValue = this.getCanvasPoint(mouseX, mouseY);
    if (squareValue) {
      let x = squareValue.x;
      let y = squareValue.y;

      this.store.dispatch(new Project.RemoveLine(x, y))
    }
  }

  zoomToFit() {
    if (!this.project) {
      return;
    }

    let zoomMargin = 20 * SQUARE_SIZE;

    // Size 1
    let width = this.project.canvasSettings.columns * SQUARE_SIZE;
    let height = this.project.canvasSettings.rows * SQUARE_SIZE;

    let widthWithMargin = width + zoomMargin;
    let heightWithMargin = height + zoomMargin;

    // Size 2
    let width2 = this.ctx.canvas.width;
    let height2 = this.ctx.canvas.height;

    let widthRatio = width2 / widthWithMargin;
    let heightRatio = height2 / heightWithMargin;

    let ratio = Math.min(widthRatio, heightRatio);

    let moveX = (width2 - (width * ratio)) / 2;
    let moveY = (height2 - (height * ratio)) / 2;

    this.transformX = moveX;
    this.transformY = moveY;
    this.zoomFactor = ratio;

    this.applyTransform();
  }

  onMouseDown(e: Event) {
    if (e instanceof MouseEvent && e.button == 0) {
      // Right mouse button to do things
      if (this.currentMode == ToolboxModes.Crossstitch) {
        if (this.currentTool == Tools.Draw || this.currentTool == Tools.Erase) {
          this.colourSquare(e.offsetX, e.offsetY, this.currentTool == Tools.Erase);
          this.isDrawDragging = true;
        }
      } else if (this.currentMode == ToolboxModes.Backstitch) {
        if (this.currentTool == Tools.Draw) {
          this.startDrawingLine(e.offsetX, e.offsetY);
          this.isDrawDragging = true;
        } else if (this.currentTool == Tools.Erase) {
          this.removeLine(e.offsetX, e.offsetY);
        }
      }
    } else if (e instanceof MouseEvent && e.button == 1) {
      // Middle mouse button to drag
      this.isPanDragging = true;
    }
  }

  onMouseMove(e: Event) {
    if (this.isPanDragging && e instanceof MouseEvent) {
      // Pan
      let moveX = e.movementX;
      let moveY = e.movementY;

      this.transformX += moveX;
      this.transformY += moveY;

      this.applyTransform();
    } else if (this.isDrawDragging && e instanceof MouseEvent) {
      if (this.currentMode == ToolboxModes.Crossstitch) {
        if (this.currentTool == Tools.Draw || this.currentTool == Tools.Erase) {
          this.colourSquare(e.offsetX, e.offsetY, this.currentTool == Tools.Erase);
        }
      } else if (this.currentMode == ToolboxModes.Backstitch) {
        if (this.currentTool == Tools.Draw) {
          this.updateLine(e.offsetX, e.offsetY);
        }
      }
    }
  }

  onMouseUp(e: Event) {
    this.isPanDragging = false;
    this.isDrawDragging = false;
    this.currentLine = undefined;
  }

  onSpacebar() {
    this.zoomToFit();
  }

  scrollFunction(e: Event) {
    // Delta y is scroll amount...
    if (e instanceof WheelEvent) {
      let deltaY = e.deltaY;
      let zoomChange = -Math.floor(deltaY / 100);

      this.zoomFactor += zoomChange * ZOOM_INC;

      if (this.zoomFactor < MIN_ZOOM) {
        this.zoomFactor = MIN_ZOOM;
      } else if (this.zoomFactor > MAX_ZOOM) {
        this.zoomFactor = MAX_ZOOM;
      }
      
      this.applyTransform();
    }
  }

  private applyTransform() {
    //console.log(`${this.zoomFactor}, ${this.transformX}, ${this.transformY}`);

    this.ctx.setTransform(this.zoomFactor, 0, 0, this.zoomFactor, this.transformX, this.transformY);
    this.redraw();
  }

}
