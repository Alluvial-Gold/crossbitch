import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './canvas/canvas.component';
import { MaterialModule } from '../material.module';
import { NgxsModule } from '@ngxs/store';
import { ProjectState } from '../core/state/project.state';

@NgModule({
  declarations: [
    CanvasComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxsModule.forFeature([ProjectState])
  ],
  exports: [
    CanvasComponent,
  ]
})
export class CanvasModule { }
