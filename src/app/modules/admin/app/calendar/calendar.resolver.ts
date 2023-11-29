import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { CalendarService } from "./calendar.service";

@Injectable({
    providedIn: "root"
})
export class EventTypeResolver implements Resolve<any>{
    constructor(private _calendarService: CalendarService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this._calendarService.getEventType();
    }
}
@Injectable({
    providedIn: "root"
})
export class CalendarResolver implements Resolve<any>{
    constructor(private _calendarService: CalendarService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this._calendarService.getCalender()
    }
}