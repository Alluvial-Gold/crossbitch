import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { ToolboxComponent } from './toolbox/toolbox.component';



@NgModule({
  declarations: [
    ToolboxComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ToolboxComponent,
  ]
})
export class ToolboxModule { }
