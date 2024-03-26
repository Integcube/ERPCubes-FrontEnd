import { SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AdsService } from '../ads.service';
import { AdAccountDetail, AdAccountList, GoogleAdAccount } from '../ads.type';

@Component({
  selector: 'app-select-ad-account',
  templateUrl: './select-ad-account.component.html',
  styleUrls: ['./select-ad-account.component.scss']
})
export class SelectAdAccountComponent implements OnInit {
  user:SocialUser
  adAccounts:GoogleAdAccount[];
  constructor(
    private _matDialogRef: MatDialogRef<SelectAdAccountComponent>,
    private adService: AdsService,
  ) { }
  displayedColumns: string[] = ['title'];
  closeDialog() {
    this._matDialogRef.close();
  }
  ngOnInit(): void {
    this.adService.GoogleAdAccount().subscribe(data => { this.adAccounts = [...data];});
    // this.adService.adAccount$.subscribe(data=>{this.adAccounts = [...data]})
    // this.adService.socailUser$.subscribe(data=>{this.user = {...data};
    //   if(this.adAccounts.length == 0){
    //     this.adService.getAdAccounts(this.user.authToken).subscribe(
    //       { next: data=>{ this.adAccounts = [...data]},
    //        error:error=>{}}
    //      )
    //   }
    // })

  }
  saveAdAccount(){    
    this.adService.saveGoogleAdAccount(this.adAccounts).subscribe(data=>{this.closeDialog()});
  }
}
