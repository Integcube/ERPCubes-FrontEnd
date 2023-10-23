import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-side-popup',
  templateUrl: './side-popup.component.html',
})
export class SidePopupComponent2  {

  constructor(
    public dialogRef: MatDialogRef<SidePopupComponent2>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
