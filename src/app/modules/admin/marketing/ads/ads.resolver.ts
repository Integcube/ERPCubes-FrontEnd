import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AdsService } from "./ads.service";

@Injectable({
    providedIn:'root'
  })
  export class ProductResolver implements Resolve<any>{
    constructor(private _adService:AdsService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._adService.getProduct();
    }
  }