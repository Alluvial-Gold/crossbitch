import { Component, OnInit } from '@angular/core';
import { DrawService, DrawServiceMode } from '../../services/draw.service';

@Component({
  selector: 'app-draw-tool-properties',
  templateUrl: './draw-tool-properties.component.html',
  styleUrls: ['./draw-tool-properties.component.scss']
})
export class DrawToolPropertiesComponent implements OnInit {

  // Modes toggle...
  modes = [
    {
      mode: DrawServiceMode.CrossStitch,
      name: "Cross Stitch",
      icon: "close"
    },
    {
      mode: DrawServiceMode.Backstitch,
      name: "Backstitch",
      icon: "show_chart"
    }
  ];
  selectedMode: any;

  constructor(
    private drawService: DrawService
  ) { 
  }

  ngOnInit(): void {
    this.selectedMode = this.drawService.currentMode;
  }

  setMode(newMode: any) {
    this.selectedMode = newMode;
    this.drawService.setCurrentMode(this.selectedMode);
  }

}
