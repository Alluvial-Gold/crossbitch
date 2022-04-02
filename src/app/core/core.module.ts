import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { NgxsModule } from '@ngxs/store';
import { ProjectState } from './state/project.state';
import { SettingsState } from './state/settings.state';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxsModule.forFeature([ProjectState, SettingsState])
  ],
  exports: [
  ]
})
export class CoreModule { }
