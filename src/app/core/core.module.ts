import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MaterialModule } from '../material.module';
import { NgxsModule } from '@ngxs/store';
import { ProjectState } from './state/project.state';
import { SettingsState } from './state/settings.state';
import { NewProjectDialogComponent } from './components/new-project-dialog/new-project-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';



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
    NgxsModule.forFeature([ProjectState, SettingsState])
  ],
  exports: [
    ToolbarComponent,
  ]
})
export class CoreModule { }
