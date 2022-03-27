import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Floss } from 'src/app/core/state/floss.model';
import { DMCFlossList } from 'src/assets/DMCColourList';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { PaletteEntry } from 'src/app/core/state/palette-entry.model';

@Component({
  selector: 'app-add-palette-entry-dialog',
  templateUrl: './add-palette-entry-dialog.component.html',
  styleUrls: ['./add-palette-entry-dialog.component.scss']
})
export class AddPaletteEntryDialogComponent implements OnInit {

  paletteEntryForm = new FormGroup({
    floss: new FormControl('', [Validators.required]),
    symbol: new FormControl('a', [Validators.required, Validators.minLength(1), Validators.maxLength(1),]),
    strands: new FormControl(2, [Validators.required, Validators.min(1), Validators.max(10)])
  })

  // Full list of flosses
  DMCFlosses: Floss[] = DMCFlossList.map((value) => {
    return {
      description: `DMC ${value.number} ${value.name}`,
      colour: value.hex
    }
  });
  filteredFlosses: Observable<Floss[]>;

  constructor(
    public dialogRef: MatDialogRef<AddPaletteEntryDialogComponent>
  ) {
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
      symbol: { value: this.paletteEntryForm.controls['symbol'].value },
      strands: this.paletteEntryForm.controls['strands'].value,
    };

    this.dialogRef.close(paletteEntry);
  }

}

