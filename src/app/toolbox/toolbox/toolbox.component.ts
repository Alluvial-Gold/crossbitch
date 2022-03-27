import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { ILayer } from 'src/app/core/state/ilayer.interface';
import { ProjectState } from 'src/app/core/state/project.state';
import { Settings } from 'src/app/core/state/settings.actions';
import { ToolboxMode } from 'src/app/core/state/settings.model';
import { SettingsState } from 'src/app/core/state/settings.state';
import { BasicLayer } from 'src/app/core/state/basic-layer.model';

// buttons...
interface ToolboxButton {
  tool: Tool,
  selected: boolean;
  disabled: boolean;
};

interface Tool {
  tool: ToolboxMode,
  name: string,
  icon: string,
  isValid: (layer: ILayer) => boolean
}

const TOOLS: Tool[] = [
  {
    tool: ToolboxMode.Fill,
    name: "Fill squares",
    icon: "square",
    isValid: (layer: ILayer) => { return layer instanceof BasicLayer; }
  },
  {
    tool: ToolboxMode.Backstitch,
    name: "Backstitch",
    icon: "show_chart",
    isValid: (layer: ILayer) => { return layer instanceof BasicLayer; }
  },
  {
    tool: ToolboxMode.Remove,
    name: "Erase",
    icon: "clear",
    isValid: (layer: ILayer) => { return layer instanceof BasicLayer; }
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
  currentMode$!: Observable<ToolboxMode>;

  @Select(ProjectState.getCurrentLayer)
  currentLayer$!: Observable<ILayer>;

  buttons: ToolboxButton[] = [];

  chosenTool: Tool | undefined;

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.buttons = TOOLS.map((tool) => {
      return {
        tool: tool,
        selected: false,
        disabled: false
      };
    })

    this.sub.add(
      this.currentLayer$.subscribe((currentLayer) => {
        // Update buttons...
        this.buttons.forEach((button) => {
          button.disabled = !button.tool.isValid(currentLayer);
        });

        // Deselect if invalid in this mode...
        if (this.chosenTool !== undefined) {
          let chosenButton = this.buttons.find((b) => b.tool.name == this.chosenTool?.name);
          if (chosenButton && chosenButton.disabled) {
            this.chosenTool = undefined;
          }
        }
      })
    );

    this.sub.add(
      this.currentMode$.subscribe((currentMode) => {
        this.chosenTool = TOOLS.find((t) => t.tool == currentMode);
      })
    )

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  selectTool() {
    // TODO deselect as well
    if (this.chosenTool) {
      this.store.dispatch(new Settings.SelectToolboxMode(this.chosenTool.tool));
    }
    
  }

}
