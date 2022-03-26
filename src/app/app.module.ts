import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToolboxModule } from './toolbox/toolbox.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { CanvasModule } from './canvas/canvas.module';
import { NgxsModule } from '@ngxs/store';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    NgxsModule.forRoot(),

    CoreModule,
    ToolboxModule,
    SidebarModule,
    CanvasModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
