import { Component, OnInit } from '@angular/core';
import { CanvasSettings } from './core/models/canvas-settings.model';
import { Project } from './core/models/project.model';
import { SquareLayer } from './core/models/square-layer.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  currentProject!: Project;

  ngOnInit(): void {
    // DEFAULT STUFF
    let settings = new CanvasSettings(89, 94, '#ffffff');
    this.currentProject = new Project(settings)

    // TEMP
    this.currentProject.layers.forEach((layer) => {
      if (layer instanceof SquareLayer) {
        layer.updatePalette(this.currentProject.palette);
      }
    })
  }
}
