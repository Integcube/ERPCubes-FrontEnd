import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { Observable, catchError, of, throwError } from 'rxjs';
import { CampaignService } from './campaign.service';
import { Campaign } from './campaign.type';

@Injectable({
  providedIn: 'root'
})
export class CampaignResolver implements Resolve<any> {
  constructor(private _campaignService: CampaignService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._campaignService.getCampaign();
  }
}
@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<any> {
  constructor(private _campaignService: CampaignService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._campaignService.getProduct();
  }
}
@Injectable({
  providedIn: 'root'
})
export class SourceResolver implements Resolve<any> {
  constructor(private _campaignService: CampaignService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._campaignService.getSource();
  }
}
@Injectable({
  providedIn: 'root'
})
export class SelectedCampaignResolver implements Resolve<any> {
  constructor(
    private _router: Router,
    private _campaignService: CampaignService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Campaign> {
    return this._campaignService.getCampaignById(route.paramMap.get('id'))
      .pipe(
        catchError((error) => {
          console.error(error);
          const parentUrl = state.url.split('/').slice(0, -1).join('/');
          this._router.navigateByUrl(parentUrl);
          return throwError(error);
        })
      );
  }
}
