import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-demo-dialog-account',
  templateUrl: './demo-dialog-account.component.html',
})
export class DemoDialogComponent implements OnInit {

  constructor(
    private _matDialogRef: MatDialogRef<DemoDialogComponent>
  ) { }

  ngOnInit(): void {
  }
  closeDialog(){
    this._matDialogRef.close();
  }
}
