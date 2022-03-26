import { ThrowStmt } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;
const ZOOM_INC = 0.1;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  @ViewChild('mainCanvas', {static: true })
  canvas: ElementRef<HTMLCanvasElement> | undefined;

  private ctx: CanvasRenderingContext2D | undefined | null;

  // Transform...
  private zoomFactor = 1;
  private transformX = 0;
  private transformY = 0;
  private isDragging = false;

  constructor() { }

  ngOnInit(): void {
    this.ctx = this.canvas?.nativeElement.getContext('2d');
  }

  ngAfterViewInit() {
    // Set height
    if (this.canvas) {
      this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
      this.canvas.nativeElement.height =  this.canvas.nativeElement.offsetHeight;
    }

    this.draw();
  }

  clear() {
    if (!this.ctx) {
      return;
    }

    let margin = 10;

    let clearX = -(this.transformX * (1/this.zoomFactor)) - margin;
    let clearY = -(this.transformY * (1/this.zoomFactor)) - margin;

    let clearWidth = 2 * margin + this.ctx.canvas.width * (1/this.zoomFactor);
    let clearHeight = 2 * margin + this.ctx.canvas.height * (1/this.zoomFactor);

    this.ctx.clearRect(clearX, clearY, clearWidth, clearHeight);
  }

  draw() {
    this.clear();

    if (!this.ctx) {
      return;
    }
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(100, 100, 100, 100);
    this.ctx.fillRect(300, 100, 100, 100);
    this.ctx.fillRect(100, 300, 100, 100);

    this.ctx.strokeStyle = "red";
    this.ctx.strokeRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

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
    if (!this.ctx) {
      return;
    }

    this.ctx.setTransform(this.zoomFactor, 0, 0, this.zoomFactor, this.transformX, this.transformY);
    this.draw();
  }

}
