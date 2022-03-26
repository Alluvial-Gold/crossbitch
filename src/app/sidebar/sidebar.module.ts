import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { KeylistComponent } from './keylist/keylist.component';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [
    SidebarComponent,
    KeylistComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    SidebarComponent,
  ]
})
export class SidebarModule { }
