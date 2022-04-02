import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FABRIC_COLOURS } from 'src/app/shared/constants/fabric-colours.constants';

@Component({
  selector: 'app-new-project-dialog',
  templateUrl: './new-project-dialog.component.html',
  styleUrls: ['./new-project-dialog.component.scss']
})
export class NewProjectDialogComponent {

  newProjectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    fabricColour: new FormControl('#ffffff', [Validators.required]),
    width: new FormControl(20, [Validators.required, Validators.min(1), Validators.max(1000)]),
    height: new FormControl(20, [Validators.required, Validators.min(1), Validators.max(1000)])
  })

  colours = FABRIC_COLOURS;

  get selectedColour(): string {
    return this.newProjectForm.controls['fabricColour'].value;
  }

  constructor(
    public dialogRef: MatDialogRef<NewProjectDialogComponent>,
  ) { }

  submitForm() {
    // TODO make interface
    let result = {
      name: this.newProjectForm.controls['name'].value,
      fabricColour: this.newProjectForm.controls['fabricColour'].value,
      width: this.newProjectForm.controls['width'].value,
      height: this.newProjectForm.controls['height'].value
    };
    this.dialogRef.close(result);
  }

}
