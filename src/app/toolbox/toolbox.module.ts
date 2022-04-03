import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { ToolboxComponent } from './components/toolbox/toolbox.component';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DrawToolPropertiesComponent } from './components/draw-tool-properties/draw-tool-properties.component';
import { EraseToolPropertiesComponent } from './components/erase-tool-properties/erase-tool-properties.component';



@NgModule({
  declarations: [
    ToolboxComponent,
    DrawToolPropertiesComponent,
    EraseToolPropertiesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
  ],
  exports: [
    ToolboxComponent,
  ]
})
export class ToolboxModule { }
