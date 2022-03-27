import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { ILayer } from 'src/app/core/state/ilayer.interface';
import { Project } from 'src/app/core/state/project.actions';
import { ProjectState } from 'src/app/core/state/project.state';
import { BasicLayer } from 'src/app/core/state/basic-layer.model';

interface LayerWrapper {
  name: string,
  type: string
}

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {

  sub: Subscription = new Subscription();

  @Select(ProjectState.getLayers)
  layers$!: Observable<ILayer[]>;

  layers: LayerWrapper[] = [];

  @Select(ProjectState.getCurrentLayer)
  currentLayer$!: Observable<ILayer>;
  currentLayer?: ILayer;

  displayedColumns: string[] = [ 'name', 'type' ];

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.sub.add(
      this.layers$.subscribe((layers) => {
        this.layers = layers.map((l) => ({
          name: l.name,
          type: this.getType(l)
        }));
      })
    )

    this.sub.add(
      this.currentLayer$.subscribe((currentLayer) => {
        this.currentLayer = currentLayer;
      })
    )
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // Nice type
  private getType(layer: ILayer): string {
    if (layer instanceof BasicLayer) {
      return "Basic";
    }
    return "Layer";
  }

 
  selectRow(row: LayerWrapper) {
    if (row.name != this.currentLayer?.name) {
      this.store.dispatch(new Project.SelectLayer(row.name));
    }
  }

}
