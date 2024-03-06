import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'newdashboard-dialog',
  templateUrl: './newdashboard-dialog.component.html',
})
export class NewDashboardDialogComponent {
    constructor(private _formBuilder: UntypedFormBuilder,
        private _matDialogRef: MatDialogRef<NewDashboardDialogComponent>,
    
    
      ) { }

    closeDialog() {
        this._matDialogRef.close();
      }

}