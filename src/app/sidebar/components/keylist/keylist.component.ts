import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { PaletteEntry } from 'src/app/core/state/palette-entry.model';
import { ProjectState } from 'src/app/core/state/project.state';

@Component({
  selector: 'app-keylist',
  templateUrl: './keylist.component.html',
  styleUrls: ['./keylist.component.scss']
})
export class KeylistComponent implements OnInit, OnDestroy {

  sub: Subscription = new Subscription();

  @Select(ProjectState.getPalette)
  palette$!: Observable<PaletteEntry[]>;
  palette: PaletteEntry[] = [];

  displayedColumns: string[] = [ 'symbol', 'name', 'colour'];

  constructor() { }

  ngOnInit(): void {
    this.sub.add(
      this.palette$.subscribe((palette) => {
        this.palette = palette;
      })
    )
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
