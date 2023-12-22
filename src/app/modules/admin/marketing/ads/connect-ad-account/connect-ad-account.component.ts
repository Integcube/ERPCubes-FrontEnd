import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SocialAuthService, FacebookLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { MatStepper } from '@angular/material/stepper';
import { AdsService } from '../ads.service';
import { SelectAdAccountComponent } from '../select-ad-account/select-ad-account.component';
import { EMPTY, catchError } from 'rxjs';
import { AdAccountList, AdList, LeadList, Product } from '../ads.type';
import { filter } from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-connect-ad-account',
  templateUrl: './connect-ad-account.component.html',
  styleUrls: ['./connect-ad-account.component.scss'],
})
export class ConnectAdAccountComponent implements OnInit {
  stepNumber = 2;
  socialMediaLogin: 'fb' | 'google' | 'linkedin';
  user: SocialUser
  adAccounts: AdAccountList[]
  leadForm: FormGroup;

  ads: AdList[];
  allLeads: LeadList[];
  product: Product[] = [];
  selectedAccount:number = 0;
  constructor(
    private _matDialogRef: MatDialogRef<ConnectAdAccountComponent>,
    private authService: SocialAuthService,
    private adService: AdsService,
    public dialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,

  ) { }
  @ViewChild('stepper') stepper: MatStepper;
  ngOnInit(): void {
    this.adService.socailUser$.subscribe(data => { this.user = { ...data } })
    this.adService.product$.subscribe(product => this.product = [...product])
    this.adService.adAccount$.subscribe(data=>{this.adAccounts = [...data]; this.selectedAccount = this.adAccounts?.filter(a=>a.isSelected === true).length;
    })
  }


  displayedColumns: string[] = ['name', 'id', 'product'];

  closeDialog() {
    this._matDialogRef.close();
    this.signOut()
  }
  setStepNumber(num: number) {
    this.stepNumber = num
  }

  loginFacebook(): void {
    this.socialMediaLogin = 'fb'
    if (this.user.authToken) {
      this.openSelectAdAcount()
    }
    else {
      this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
        .then((user: SocialUser) => {
          if (user.authToken) {
            this.adService.setSocialUser(user);
            this.adService.facebookLogin(user).pipe(catchError(err => { alert(err); return EMPTY }))
              .subscribe(data => this.openSelectAdAcount())
          }
        })
        .catch(err => {
          console.log('Facebook login failed', err);
          this.signOut();
        })
    }

  }
  openSelectAdAcount() {
    const dialogRef = this.dialog.open(SelectAdAccountComponent
      ,
      {
        width: "80%",
        maxWidth: "80%",
      }
    );
  }

  setProduct(adId: string, productId) {
    let i = this.ads.findIndex(a => a.id == adId);
    this.ads[i].productId = productId;

  }
  returnProductName(id: number): string {
    return this.product.find(a => a.productId === id).productName;
  }
  loginGoogle(): void {
    this.socialMediaLogin = 'google'
  }
  linkedIn(): void {
    this.socialMediaLogin = 'linkedin'
  }



  getAllLeads() {
    this.adService.getAllLeads(this.ads, this.user.authToken).subscribe(
      {
        next: data => {
          const filteredData = data.filter(obj => obj.data.length !== 0)
            .map(obj => obj.data);

          this.allLeads = [].concat(...filteredData);
         
        },
        error: err => {  }
      }
    );
  }
  moveStepperToNextStep(): void {

      if(this.stepper.selectedIndex == 0){
        this.getAllAds()
      }
      if(this.stepper.selectedIndex == 1){
        this.getAllLeads()
      }
      this.stepper.next();

  }

  moveStepperToPreviousStep(): void {
    if (this.stepper.selectedIndex > 0) {
      this.stepper.previous();
    }
  }
  getAllAds() {
    this.adService.getAllAds(this.adAccounts, this.user.authToken).subscribe(
      {
        next: a => { this.ads = a.flatMap(a=>a.data)},
        error: err => { }
      }
    );
  }
  signOut(): void {
    this.authService.signOut();
    this.user = new SocialUser
  }
}
