import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { NewProjectDialogComponent } from './components/new-project-dialog/new-project-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { ProjectState } from '../core/state/project.state';
import { SettingsState } from '../core/state/settings.state';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [
    ToolbarComponent,
    NewProjectDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxsModule.forFeature([ProjectState, SettingsState]),
  ],
  exports: [
    ToolbarComponent
  ]
})
export class ToolbarModule { }
