import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, EMPTY, Observable, catchError, forkJoin, map, mergeMap, switchMap, tap } from 'rxjs';
import { SocialUser } from '@abacritt/angularx-social-login';
import { AdAccountList, AdAccounts, AdAcountName, AdList, LeadList, Product } from './ads.type';

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private apiUrl = 'https://graph.facebook.com/v18.0';
  private googleUrl = 'https://www.googleapis.com/oauth2/v15'
  private readonly getProductUrl = `${environment.url}/Product/all`
  private readonly saveLeadUrl = `$oo{environment.url}/Lead/bulkSave`
  private readonly saveAdAccount = `$oo{environment.url}/AdAccount/bulkAdSave`
  private readonly saveCampaignBulk = `$oo{environment.url}/Campaign/saveBulk`

  private readonly loginFacebookUrl = `${environment.url}/FacebookLogin/facebook-login`
  user: User;
  private _loggedInUser: BehaviorSubject<SocialUser | null> = new BehaviorSubject(null);
  private _adAccounts: BehaviorSubject<AdAccountList[] | null> = new BehaviorSubject([]);
  private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(null);
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
  ) {
    this._userService.user$.subscribe(user => {
      this.user = user;
    })
  }

  get socailUser$(): Observable<SocialUser> {
    return this._loggedInUser.asObservable()
  }
  get adAccount$(): Observable<AdAccountList[]> {
    return this._adAccounts.asObservable()
  }
  getAdAccounts(accessToken: string): Observable<AdAccountList[]> {
    const url = `${this.apiUrl}/me?fields=id,name,adaccounts&access_token=${accessToken}`;
    return this._httpClient.get<AdAccounts>(url).pipe(
      mergeMap(adAccounts => {
        const adAccountData = adAccounts.adaccounts.data || [];
        const requests = adAccountData.map(account => {
          const accountUrl = `${this.apiUrl}/${account.id}?fields=name&access_token=${accessToken}`;
          return this._httpClient.get<any>(accountUrl).pipe(
            map(accountInfo => ({
              ...account,
              title: accountInfo.name // Assuming 'name' is the field containing the account name
            } as AdAccountList))
          );
        });
        return forkJoin(requests);
      }),
      tap(a => this._adAccounts.next(a))
    );
  }


  getAdsAccountInfo(idToken: string, id:string) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${idToken}`)
      .set('Content-Type', 'application/json');

    // Replace 'customerId' with the actual Google Ads customer ID
    const customerId = id; 

    // Replace 'resource_name' with the resource you want to fetch (e.g., campaigns, ad accounts)
    const resourceName = 'customers/' + customerId + '/campaigns';
    debugger

    return this._httpClient.get('https://googleads.googleapis.com/v8/' + resourceName, { headers });
  }
  setAdAccount(acount: AdAccountList[]) {
    this._adAccounts.next(acount)
  }
  facebookLogin(user: SocialUser): Observable<any> {
    const data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      FbUser: user
    };
    return this._httpClient.post<any>(this.loginFacebookUrl, data).pipe(
      tap(data => {
      })
    );
  }
  saveLeads(leads:LeadList[]): Observable<any> {
    const data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      lead: leads
    };
    return this._httpClient.post<any>(this.saveLeadUrl, data).pipe(
      tap(data => {
      })
    );
  } 
  setSocialUser(user: SocialUser) {
    this._loggedInUser.next(user);
  }
  get product$(): Observable<Product[]> {
    return this._products.asObservable();
  }
  getProduct(): Observable<Product[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Product[]>(this.getProductUrl, data).pipe(
      tap((product) => {
        this._products.next(product);
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  getAllAds(adAccounts: AdAccountList[], access_token: string): Observable<any> {
    const selectedAdAccountIds = adAccounts?.filter(account => account.isSelected).map(account => account.id);
    const requests = selectedAdAccountIds?.map(accountId => {
      const accountUrl = `${this.apiUrl}/${accountId}/ads?fields=id,name,daily_budget&access_token=${access_token}`;
      return this._httpClient.get<any[]>(accountUrl);
    });
    return forkJoin(requests).pipe(
      map(adDataArray => { return adDataArray.flat() })
    );
  }
  getAllLeads(ads: AdList[], access_token: string): Observable<any> {
    const requests = ads.map(ad => {
      const accountUrl = `${this.apiUrl}/${ad.id}/leads?fields=created_time,id,ad_id,ad_name,form_id,field_data,name,email&access_token=${access_token}`;
      return this._httpClient.get<any[]>(accountUrl);
    });
    return forkJoin(requests).pipe(
      map(adDataArray => { return adDataArray.flat() })
    );
  }
  getGoogleAdAccount(accessToken: string) {
    const url = `${this.googleUrl}/customers?access_token=${accessToken}`;
    return this._httpClient.get<any>(url).pipe(
      tap(a => { debugger })
    );
  }
  connectGoogle(){
  const data = {
    tenantId : this.user.tenantId, 
    id :this.user.id
  }
    return this._httpClient.post<any>(`${environment.url}/ConnectGoogle/Connect`,data).pipe(
      tap(a=>window.open(a.googleAuthUrl)),
      catchError(error=>{return EMPTY})
    );
  }
  saveBulkAdAccount(ads:AdAccountList[]): Observable<any> {
    const data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      ads: ads
    };
    return this._httpClient.post<any>(this.saveAdAccount, data).pipe(
      tap(data => {
      })
    );
  }
  saveBulkCampaign(campaign:AdList[]): Observable<any>{
    const data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      campaign: campaign
    };
    return this._httpClient.post<any>(this.saveCampaignBulk, data).pipe(
      tap(data => {
      })
    );

  }
}
