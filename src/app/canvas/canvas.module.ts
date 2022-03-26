import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './canvas/canvas.component';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [
    CanvasComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    CanvasComponent,
  ]
})
export class CanvasModule { }
