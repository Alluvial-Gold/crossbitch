import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MaterialModule } from '../material.module';
import { NgxsModule } from '@ngxs/store';
import { ProjectState } from './state/project.state';



@NgModule({
  declarations: [
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxsModule.forFeature([ProjectState])
  ],
  exports: [
    ToolbarComponent,
  ]
})
export class CoreModule { }
