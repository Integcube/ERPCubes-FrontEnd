import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { WidgetService } from "./widget.service";

// @Injectable({
//     providedIn: 'root'
//   })
//   export class LeadsResolver implements Resolve<any> {
//     constructor(
//       private _widgetService: WidgetService){ }
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
//       return this._widgetService.getLeads();
//     }
//   }
