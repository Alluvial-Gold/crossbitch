import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { PaletteEntry } from 'src/app/core/state/palette-entry.model';
import { Project } from 'src/app/core/state/project.actions';
import { ProjectState } from 'src/app/core/state/project.state';
import { AddPaletteEntryDialogComponent } from '../add-palette-entry-dialog/add-palette-entry-dialog.component';
import { DeletePaletteEntryDialogComponent } from '../delete-palette-entry-dialog/delete-palette-entry-dialog.component';

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

  @Select(ProjectState.getCurrentColour)
  currentColour$!: Observable<PaletteEntry>;
  currentColour?: PaletteEntry;

  displayedColumns: string[] = [ 'symbol', 'name' ];

  constructor(
    public dialog: MatDialog,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.sub.add(
      this.palette$.subscribe((palette) => {
        this.palette = palette;
      })
    );

    this.sub.add(
      this.currentColour$.subscribe((currentColour) => {
        this.currentColour = currentColour;
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddPaletteEntryDialogComponent, {
      width: '400px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new Project.AddPaletteEntry(result));
      }
    })
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(AddPaletteEntryDialogComponent, {
      width: '400px',
      autoFocus: false,
      data: this.currentColour,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new Project.UpdateCurrentPaletteEntry(result));
      }
    })
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeletePaletteEntryDialogComponent, {
      width: '400px',
      data: {
        // TODO make this an interface
        currentColour: this.currentColour,
        palette: this.palette
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let currentIndex = this.palette.findIndex(e => e.floss.description === this.currentColour?.floss.description)
        this.store.dispatch(new Project.DeletePaletteEntry(currentIndex, result.paletteIndex));
      }
    })
  }

  selectRow(row: PaletteEntry) {
    if (row != this.currentColour) {
      this.store.dispatch(new Project.SelectPaletteColour(row));
    }
  }

}
