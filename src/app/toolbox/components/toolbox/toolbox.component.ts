import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Settings } from 'src/app/core/state/settings.actions';
import { SettingsState } from 'src/app/core/state/settings.state';
import { ToolboxMode, ToolboxModes } from '../../interfaces/toolbox-mode.interface';
import { Tool, Tools } from '../../interfaces/tool.interface';

// Modes
export const TOOLBOX_MODES: ToolboxMode[] = [
  {
    mode: ToolboxModes.Crossstitch,
    name: "Crossstitch",
    icon: "clear"
  },
  {
    mode: ToolboxModes.Backstitch,
    name: "Backstitch",
    icon: "show_chart"
  }
];

// Tools
const TOOLS: Tool[] = [
  {
    tool: Tools.Draw,
    name: "Draw",
    icon: "edit",
    validModes: [ToolboxModes.Crossstitch, ToolboxModes.Backstitch]
  },
  {
    tool: Tools.Erase,
    name: "Erase",
    icon: "delete",
   validModes: [ToolboxModes.Crossstitch, ToolboxModes.Backstitch]
  }
];

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss']
})
export class ToolboxComponent implements OnInit, OnDestroy {

  sub: Subscription = new Subscription();

  @Select(SettingsState.getCurrentToolboxMode)
  currentMode$!: Observable<ToolboxModes>;

  @Select(SettingsState.getCurrentTool)
  currentTool$!: Observable<Tools>;

  modes: ToolboxMode[] = TOOLBOX_MODES;
  tools: Tool[] = TOOLS;

  chosenMode: ToolboxMode | undefined;
  chosenTool: Tool | undefined;

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {

    this.sub.add(
      this.currentMode$.subscribe((currentMode) => {
        // Update mode
        this.chosenMode = this.modes.find((t) => t.mode == currentMode);
      
        if (this.chosenMode) {
          // Update tools
          this.tools = TOOLS.filter(t => t.validModes.includes(this.chosenMode!.mode));
        } else {
          this.tools = [];
        }
      })
    );

    this.sub.add(
      this.currentTool$.subscribe((currentTool) => {
        // Update tool
        this.chosenTool = this.tools.find((t) => t.tool == currentTool);
      })
    )

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  selectMode() {
    if (this.chosenMode) {
      this.store.dispatch(new Settings.SelectToolboxMode(this.chosenMode.mode));
    }
  }

  selectTool() {
    if (this.chosenTool) {
      this.store.dispatch(new Settings.SelectTool(this.chosenTool.tool));
    }
  }

}
