import { Component, Inject, OnInit } from '@angular/core';
import { Form } from '../form-builder.type';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent implements OnInit {

  constructor(public matDialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { form: Form },
    private _formBuilder: UntypedFormBuilder,) { }

  ngOnInit(): void {
  }
  close(): void {
    this.matDialogRef.close();
  }
}
