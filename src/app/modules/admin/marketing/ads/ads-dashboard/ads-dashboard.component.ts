import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateAdAccountComponent } from '../create-ad-account/create-ad-account.component';
import { ConnectAdAccountComponent } from '../connect-ad-account/connect-ad-account.component';
import { DemoDialogComponent } from '../demo-dialog/demo-dialog-account.component';
import { AdsService } from '../ads.service';
import { AlertService } from 'app/core/alert/alert.service';

@Component({
  selector: 'app-ads-dashboard',
  templateUrl: './ads-dashboard.component.html',
  styleUrls: ['./ads-dashboard.component.scss']
})
export class AdsDashboardComponent implements OnInit {

  constructor(public dialog: MatDialog, private _alertService:AlertService) { }

  ngOnInit(): void {
  }
  openConnectorDialog() {
    const dialogRef = this.dialog.open(ConnectAdAccountComponent,
      {
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
        disableClose: true 
      }
    );
  }
  openCreatorDialog() {
    const dialogRef = this.dialog.open(CreateAdAccountComponent);
  }
  openDemoDialog(){
    const dialogRef = this.dialog.open(DemoDialogComponent);

  }
}
