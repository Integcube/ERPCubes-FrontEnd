import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Campaign, Product, Source } from './campaign.type';
import { User } from 'app/core/user/user.types';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { UserService } from 'app/core/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private readonly getCampaignURL = `${environment.url}/Campaign/all`
  private readonly saveCampaignURL = `${environment.url}/Campaign/save`
  private readonly deleteCampaignURL = `${environment.url}/Campaign/delete`
  private readonly getProductURL = `${environment.url}/Product/all`
  private readonly getSourceURL = `${environment.url}/Campaign/allSources`
  user: User
  private _campaigns: BehaviorSubject < Campaign[] | null > = new BehaviorSubject(null);
  private _campaign: BehaviorSubject < Campaign | null > = new BehaviorSubject(null);
  private _products: BehaviorSubject < Product[] | null > = new BehaviorSubject(null);
  private _sources: BehaviorSubject < Source[] | null > = new BehaviorSubject(null);
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService,
    private snackBar: MatSnackBar
  )  { 
    this._userService.user$.subscribe(user => this.user = user ) 
  }
  get campaigns$(): Observable<Campaign[]>{
    return this._campaigns.asObservable()
  }
  get campaign$(): Observable<Campaign>{
    return this._campaign.asObservable()
  }
  get products$(): Observable<Product[]>{
    return this._products.asObservable()
  }
  get sources$(): Observable<Source[]>{
    return this._sources.asObservable()
  }
  getCampaign(): Observable<Campaign[]>{
    let data: any = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Campaign[]>(this.getCampaignURL, data).pipe(
      tap((campaigns) => {
        this._campaigns.next(campaigns);
      }),
      catchError(err => this.handleError(err))
    )
  }
  saveCampaign(campaign: FormGroup): Observable<Campaign[]>{
    let data: any = {
      campaignId: campaign.value.campaignId,
      adAccountId: campaign.value.adAccountId,
      title: campaign.value.title,
      productId: +campaign.value.productId,
      sourceId: +campaign.value.sourceId,
      budget: campaign.value.budget,
      tenantId: this.user.tenantId,
      id: this.user.id,
    }
    return this._httpClient.post<Campaign[]>(this.saveCampaignURL, data).pipe(
      tap((campaigns) => {
        this.getCampaign().subscribe()
      }),
      catchError(err => this.handleError(err))
    );
  }
  deleteCampaign(campaignId: string): Observable<Campaign[]>{
    let data: any = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      campaignId: campaignId
    }
    return this._httpClient.post<Campaign[]>(this.deleteCampaignURL, data).pipe(
      tap((campaigns) => {
        this.getCampaign().subscribe()
      }),
      catchError(err => this.handleError(err))
    );
  }
  selectedCampaign(selectedCampaign: Campaign){
    this._campaign.next(selectedCampaign);
  }
  getCampaignById(id: string): Observable<Campaign> {
    return this._campaigns.pipe(
      take(1),
      map((campaigns) => {
        if(id ===  '-1') {
          const campaign = new Campaign({});
          this._campaign.next(campaign);
          return campaign;
        }
        else {
          const campaign = campaigns.find( item => item.campaignId === id) || null
          this._campaign.next(campaign)
          return campaign
        }
      }),
      switchMap((campaign) => {
        if (!campaign) {
          return throwError('Could not find campaign with id of ' + id + '!');
        }
        return of(campaign);
      })
    )
  }
  getProduct(): Observable<Product[]> {
    let data: any = {
      id: this.user.id,
      tenantId: this.user.tenantId
    }
    return this._httpClient.post<Product[]>(this.getProductURL, data).pipe(
      tap((products) => {
        this._products.next(products)
      }),
      catchError(err => this.handleError(err))
    );
  }
  getSource(): Observable<Source[]> {
    let data: any = {
      id: this.user.id,
      tenantId: this.user.tenantId
    }
    return this._httpClient.post<Source[]>(this.getSourceURL, data).pipe(
      tap((sources) => {
        this._sources.next(sources)
      }),
      catchError(err => this.handleError(err))
    );
  }
  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    this.showNotification('snackbar-success', errorMessage, 'bottom', 'center');
    return throwError(() => errorMessage);
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
