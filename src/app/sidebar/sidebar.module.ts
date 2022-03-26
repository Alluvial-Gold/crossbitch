import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PaletteComponent } from './components/palette/palette.component';
import { MaterialModule } from '../material.module';
import { CoreModule } from '../core/core.module';
import { LayersComponent } from './components/layers/layers.component';

@NgModule({
  declarations: [
    SidebarComponent,
    PaletteComponent,
    LayersComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CoreModule,
  ],
  exports: [
    SidebarComponent,
  ]
})
export class SidebarModule { }
