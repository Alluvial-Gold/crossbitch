import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { SQUARE_SIZE } from 'src/app/core/constants';
import { Project } from 'src/app/core/models/project.model';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;
const ZOOM_INC = 0.1;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  @Input()
  project!: Project;

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
  private isDragging = false;

  private gridPattern!: CanvasPattern;

  constructor() {}

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
        this.draw();
      }
    }
  }

  ngAfterViewInit() {
    // Set height
    if (this.canvas) {
      this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
      this.canvas.nativeElement.height =  this.canvas.nativeElement.offsetHeight;
    }

    this.draw();
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

  draw() {
    this.clear();

    let width = this.project.canvasSettings.columns * SQUARE_SIZE;
    let height = this.project.canvasSettings.rows * SQUARE_SIZE;

    // 1. Draw background
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, width, height);

    // 2. Draw layers
    this.project.layers.forEach(layer => {
      // TODO
      layer.drawLayer(this.ctx);
    });

    // 3. Draw lines on top
    this.drawLines(width, height);

    // 4. Draw text for lines outside of box
    // TODO - later

    // 5. Draw center line - later
  }

  private drawLines(width: number, height: number) {
    this.ctx.fillStyle = this.gridPattern;
    this.ctx.fillRect(0, 0, width, height);
  }

  zoomToFit() {
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
    // Middle mouse button to drag
    if (e instanceof MouseEvent && e.button == 1) {
      this.isDragging = true;
    }
  }

  onMouseMove(e: Event) {
    if (this.isDragging && e instanceof MouseEvent) {
      let moveX = e.movementX;
      let moveY = e.movementY;

      this.transformX += moveX;
      this.transformY += moveY;

      this.applyTransform();
    }
  }

  onMouseUp(e: Event) {
    this.isDragging = false;
  }

  onSpacebar() {
    console.log('spacebar');
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
    this.draw();
  }

}
