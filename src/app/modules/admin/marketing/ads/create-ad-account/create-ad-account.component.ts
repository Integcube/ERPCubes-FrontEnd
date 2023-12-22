import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-ad-account',
  templateUrl: './create-ad-account.component.html',
  styleUrls: ['./create-ad-account.component.scss']
})
export class CreateAdAccountComponent implements OnInit {

  constructor(
    private _matDialogRef: MatDialogRef<CreateAdAccountComponent>
  ) { }

  ngOnInit(): void {
  }
  closeDialog(){
    this._matDialogRef.close();
  }
}
