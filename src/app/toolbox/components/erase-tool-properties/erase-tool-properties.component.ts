import { Component, OnInit } from '@angular/core';
import { EraseService, EraseServiceMode } from '../../services/erase.service';

@Component({
  selector: 'app-erase-tool-properties',
  templateUrl: './erase-tool-properties.component.html',
  styleUrls: ['./erase-tool-properties.component.scss']
})
export class EraseToolPropertiesComponent implements OnInit {

  // Modes toggle...
  modes = [
    {
      mode: EraseServiceMode.CrossStitch,
      name: "Cross Stitch",
      icon: "close"
    },
    {
      mode: EraseServiceMode.Backstitch,
      name: "Backstitch",
      icon: "show_chart"
    }
  ];
  selectedMode: any;

  constructor(private eraseService: EraseService) { }

  ngOnInit(): void {
    this.selectedMode = this.eraseService.currentMode;
  }

  setMode(newMode: any) {
    this.selectedMode = newMode;
    this.eraseService.setCurrentMode(this.selectedMode);
  }

}
