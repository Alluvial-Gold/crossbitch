import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaletteEntry } from 'src/app/core/state/palette-entry.model';

@Component({
  selector: 'app-delete-palette-entry-dialog',
  templateUrl: './delete-palette-entry-dialog.component.html',
  styleUrls: ['./delete-palette-entry-dialog.component.scss']
})
export class DeletePaletteEntryDialogComponent implements OnInit {

  deleteForm = new FormGroup({
    floss: new FormControl('', [Validators.required]),
  })

  paletteOptions: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DeletePaletteEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentColour: PaletteEntry, palette: PaletteEntry[]},
  ) { 
    this.paletteOptions = data.palette
      .filter((p) => p.floss.description != data.currentColour.floss.description)
      .map((p) => p.floss.description);
    this.paletteOptions.unshift("None");
  }

  ngOnInit(): void {
  }

  submitForm() {
    // Return palette index (or -1 if none)

    let value = this.deleteForm.controls['floss'].value;

    let idx = this.data.palette.findIndex(p => p.floss.description === value);
    this.dialogRef.close({ paletteIndex: idx });
  }

}
