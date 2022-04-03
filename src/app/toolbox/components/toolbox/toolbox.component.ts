import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Settings } from 'src/app/core/state/settings.actions';
import { SettingsState } from 'src/app/core/state/settings.state';
import { IToolService } from '../../interfaces/itool.service.interface';
import { Tool } from '../../interfaces/tool.interface';
import { DrawToolService } from '../../services/draw-tool.service';
import { EraseToolService } from '../../services/erase-tool.service';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss']
})
export class ToolboxComponent implements OnInit, OnDestroy {

  sub: Subscription = new Subscription();

  @Select(SettingsState.getCurrentTool)
  currentTool$!: Observable<IToolService>;
  currentTool?: Tool;

  // List of tools
  drawTool = {
    name: "Draw",
    icon: "edit",
    service: this.drawService
  };
  eraseTool = {
    name: "Erase",
    icon: "delete",
    service: this.eraseService
  };
  tools: Tool[] = [
    this.drawTool,
    this.eraseTool,
  ];

  constructor(
    private store: Store,
    // tool services
    private drawService: DrawToolService,
    private eraseService: EraseToolService,
  ) { }

  ngOnInit(): void {

    this.sub.add(
      this.currentTool$.subscribe((currentTool) => {
        // Update tool
        this.currentTool = this.tools.find((t) => t.service == currentTool);
      })
    );

    // Initial select...
    this.selectTool(this.tools[0]);

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  selectTool(tool: Tool) {
    if (tool && this.currentTool?.service != tool.service) {
      this.store.dispatch(new Settings.SelectTool(tool.service));
    }
  }

}
