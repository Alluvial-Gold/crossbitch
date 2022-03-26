import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { KeylistComponent } from './components/keylist/keylist.component';
import { MaterialModule } from '../material.module';
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [
    SidebarComponent,
    KeylistComponent
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
