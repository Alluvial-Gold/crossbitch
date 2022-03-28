import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-project-dialog',
  templateUrl: './new-project-dialog.component.html',
  styleUrls: ['./new-project-dialog.component.scss']
})
export class NewProjectDialogComponent implements OnInit {

  newProjectForm = new FormGroup({
    width: new FormControl(20, [Validators.required, Validators.min(1), Validators.max(1000)]),
    height: new FormControl(20, [Validators.required, Validators.min(1), Validators.max(1000)])
  })

  constructor(
    public dialogRef: MatDialogRef<NewProjectDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  submitForm() {
    // Make palette entry
    let result = {
      width: this.newProjectForm.controls['width'].value,
      height: this.newProjectForm.controls['height'].value
    };
    this.dialogRef.close(result);
  }

}
