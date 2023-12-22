import { SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AdsService } from '../ads.service';
import { AdAccountDetail, AdAccountList } from '../ads.type';

@Component({
  selector: 'app-select-ad-account',
  templateUrl: './select-ad-account.component.html',
  styleUrls: ['./select-ad-account.component.scss']
})
export class SelectAdAccountComponent implements OnInit {
  user:SocialUser
  adAccounts:AdAccountList[];
  constructor(
    private _matDialogRef: MatDialogRef<SelectAdAccountComponent>,
    private adService: AdsService,
  ) { }
  displayedColumns: string[] = ['adaccount', 'adaccountId'];
  closeDialog() {
    this._matDialogRef.close();
  }
  ngOnInit(): void {
    this.adService.adAccount$.subscribe(data=>{this.adAccounts = [...data]})
    this.adService.socailUser$.subscribe(data=>{this.user = {...data};
      if(this.adAccounts.length == 0){
        this.adService.getAdAccounts(this.user.authToken).subscribe(
          { next: data=>{ this.adAccounts = [...data]},
           error:error=>{}}
         )
      }
    })

  }
  saveAdAccount(){    
    this.adService.setAdAccount(this.adAccounts)
    this.closeDialog();
  }
}
