import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateAdAccountComponent } from '../create-ad-account/create-ad-account.component';
import { ConnectAdAccountComponent } from '../connect-ad-account/connect-ad-account.component';

@Component({
  selector: 'app-ads-dashboard',
  templateUrl: './ads-dashboard.component.html',
  styleUrls: ['./ads-dashboard.component.scss']
})
export class AdsDashboardComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openConnectorDialog() {
    const dialogRef = this.dialog.open(ConnectAdAccountComponent,
      {
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "100%"
      }
    );
  }
  openCreatorDialog() {
    const dialogRef = this.dialog.open(CreateAdAccountComponent);
  }
}
