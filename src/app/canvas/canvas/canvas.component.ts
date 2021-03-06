import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SQUARE_SIZE } from 'src/app/core/constants';
import { ProjectModel } from 'src/app/core/state/project.model';
import { ProjectState } from 'src/app/core/state/project.state';
import { SettingsState } from 'src/app/core/state/settings.state';
import { filter } from 'rxjs/operators';
import { IToolService } from 'src/app/toolbox/interfaces/itool.service.interface';
import { FabricPoint } from 'src/app/shared/interfaces/fabric-point.interface';
import { BasicLayerService } from 'src/app/core/services/basic-layer.service';
import { BasicLayer } from 'src/app/core/state/basic-layer.model';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;
const ZOOM_INC = 0.1;

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

  @Select(SettingsState.getCurrentTool)
  currentTool$!: Observable<IToolService>;
  currentTool?: IToolService;

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

  private gridPattern!: CanvasPattern;

  constructor(
    private store: Store,
    private basicLayerService: BasicLayerService
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

    let width = this.project.fabricSettings.columns * SQUARE_SIZE;
    let height = this.project.fabricSettings.rows * SQUARE_SIZE;

    // Background
    this.ctx.fillStyle = this.project.fabricSettings.colour;
    this.ctx.fillRect(0, 0, width, height);

    // Cross stitch layers
    for (let layerIdx = 0; layerIdx < this.project.layers.length; layerIdx++) {
      let layer = this.project.layers[layerIdx] as BasicLayer;
      this.basicLayerService.drawCrossstitchLayer(layer, this.ctx, this.project.palette);
    }

    // Grid lines
    this.drawGridLines(width, height);

    // Backstitch layers
    for (let layerIdx = 0; layerIdx < this.project.layers.length; layerIdx++) {
      let layer = this.project.layers[layerIdx] as BasicLayer;
      this.basicLayerService.drawBackstitchLayer(layer, this.ctx, this.project.palette);
    }
  }

  private drawGridLines(width: number, height: number) {
    this.ctx.fillStyle = this.gridPattern;
    this.ctx.fillRect(0, 0, width, height);
  }

  private getFabricPoint(mouseX: number, mouseY: number): FabricPoint {
    let xInCanvas = mouseX - this.transformX;
    let yInCanvas = mouseY - this.transformY;
    let xValue = xInCanvas / (SQUARE_SIZE * this.zoomFactor);
    let yValue = yInCanvas / (SQUARE_SIZE * this.zoomFactor);

    return { x: xValue, y: yValue };
  }

  zoomToFit() {
    if (!this.project) {
      return;
    }

    let zoomMargin = 20 * SQUARE_SIZE;

    // Size 1
    let width = this.project.fabricSettings.columns * SQUARE_SIZE;
    let height = this.project.fabricSettings.rows * SQUARE_SIZE;

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
    if (!this.project) {
      return;
    }

    if (e instanceof MouseEvent && e.button == 0) {
      let fabricPoint = this.getFabricPoint(e.offsetX, e.offsetY);
      this.currentTool?.onMouseDown(fabricPoint);
    } else if (e instanceof MouseEvent && e.button == 1) {
      // Middle mouse button to drag
      this.isPanDragging = true;
    }
  }

  onMouseMove(e: Event) {
    if (!this.project) {
      return;
    }

    if (this.isPanDragging && e instanceof MouseEvent) {
      // Pan
      let moveX = e.movementX;
      let moveY = e.movementY;

      this.transformX += moveX;
      this.transformY += moveY;

      this.applyTransform();
    } else if (e instanceof MouseEvent) {
      let fabricPoint = this.getFabricPoint(e.offsetX, e.offsetY);
      this.currentTool?.onMouseMove(fabricPoint);
    }
  }

  onMouseUp(e: Event) {
    if (!this.project) {
      return;
    }

    this.isPanDragging = false;
    this.currentTool?.onMouseUp();
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
    this.ctx.setTransform(this.zoomFactor, 0, 0, this.zoomFactor, this.transformX, this.transformY);
    this.redraw();
  }

}
