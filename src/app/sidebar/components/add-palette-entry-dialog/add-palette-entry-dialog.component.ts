import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Floss } from 'src/app/core/state/floss.model';
import { DMCFlossList } from 'src/assets/DMCFlossList';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaletteEntry } from 'src/app/core/state/palette-entry.model';
import { Icon, Icons } from 'src/app/shared/icons.constants';
import { Line, Lines } from 'src/app/shared/lines.constants';

@Component({
  selector: 'app-add-palette-entry-dialog',
  templateUrl: './add-palette-entry-dialog.component.html',
  styleUrls: ['./add-palette-entry-dialog.component.scss']
})
export class AddPaletteEntryDialogComponent implements OnInit {

  paletteEntryForm = new FormGroup({
    floss: new FormControl('', [Validators.required]),
    iconIndex: new FormControl('', [Validators.required]),
    crossStitchStrands: new FormControl(2, [Validators.required, Validators.min(1), Validators.max(10)]),
    lineIndex: new FormControl(0, [Validators.required]),
    backstitchStrands: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]),
  })

  // Full list of flosses
  DMCFlosses: Floss[] = DMCFlossList.map((value) => {
    return {
      description: `DMC ${value.number} ${value.name}`,
      colour: value.hex
    }
  });
  filteredFlosses: Observable<Floss[]>;

  icons: Icon[] = Icons;
  lines: Line[] = Lines;

  isEditMode = false;

  get selectedIcon(): Icon {
    return this.icons[this.paletteEntryForm.get('iconIndex')?.value];
  }
  get selectedLine(): Line {
    return this.lines[this.paletteEntryForm.get('lineIndex')?.value];
  }

  constructor(
    public dialogRef: MatDialogRef<AddPaletteEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaletteEntry,
  ) {
    if (data) {
      this.isEditMode = true;

      // Populate data...
      this.paletteEntryForm.patchValue({
        floss: data.floss,
        iconIndex: data.iconIndex,
        crossStitchStrands: data.crossStitchStrands,
        lineIndex: data.lineIndex,
        backstitchIndex: data.backstitchStrands
      });
    }

    this.filteredFlosses = this.paletteEntryForm.controls['floss'].valueChanges.pipe(
      startWith(''),
      map(state => (state ? this.filterFlosses(state) : this.DMCFlosses.slice())),
    );
   }

  ngOnInit(): void {
  }

  private filterFlosses(value: string | Floss): Floss[] {
    let filterValue = '';
    if ((value as Floss).description != undefined) {
      filterValue = (value as Floss).description.toLowerCase();
    } else {
      filterValue = (value as string).toLowerCase();
    }

    return this.DMCFlosses.filter(floss => floss.description.toLowerCase().includes(filterValue));
  }

  getFlossText(floss: Floss): string {
    return floss ? floss.description : '';
  }

  submitForm() {
    // Make palette entry
    let paletteEntry: PaletteEntry = {
      floss: this.paletteEntryForm.controls['floss'].value,
      iconIndex: this.paletteEntryForm.controls['iconIndex'].value,
      crossStitchStrands: this.paletteEntryForm.controls['crossStitchStrands'].value,
      lineIndex: this.paletteEntryForm.controls['lineIndex'].value,
      backstitchStrands: this.paletteEntryForm.controls['backstitchStrands'].value,
    };

    this.dialogRef.close(paletteEntry);
  }

}

