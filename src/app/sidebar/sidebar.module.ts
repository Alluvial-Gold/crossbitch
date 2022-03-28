import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PaletteComponent } from './components/palette/palette.component';
import { MaterialModule } from '../material.module';
import { CoreModule } from '../core/core.module';
import { LayersComponent } from './components/layers/layers.component';
import { AddPaletteEntryDialogComponent } from './components/add-palette-entry-dialog/add-palette-entry-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxsModule } from '@ngxs/store';
import { ProjectState } from '../core/state/project.state';
import { DeletePaletteEntryDialogComponent } from './components/delete-palette-entry-dialog/delete-palette-entry-dialog.component';

@NgModule({
  declarations: [
    SidebarComponent,
    PaletteComponent,
    LayersComponent,
    AddPaletteEntryDialogComponent,
    DeletePaletteEntryDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  exports: [
    SidebarComponent,
  ]
})
export class SidebarModule { }
