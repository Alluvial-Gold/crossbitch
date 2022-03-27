import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { PaletteEntry } from 'src/app/core/state/palette-entry.model';
import { Project } from 'src/app/core/state/project.actions';
import { ProjectState } from 'src/app/core/state/project.state';
import { AddPaletteEntryDialogComponent } from '../add-palette-entry-dialog/add-palette-entry-dialog.component';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss']
})
export class PaletteComponent implements OnInit, OnDestroy {

  sub: Subscription = new Subscription();

  @Select(ProjectState.getPalette)
  palette$!: Observable<PaletteEntry[]>;
  palette: PaletteEntry[] = [];

  displayedColumns: string[] = [ 'symbol', 'name', 'colour', 'strands'];

  constructor(
    public dialog: MatDialog,
    private store: Store
  ) { }

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

  openDialog(): void {
    const dialogRef = this.dialog.open(AddPaletteEntryDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new Project.AddPaletteEntry(result));
      }
    })
  }

}