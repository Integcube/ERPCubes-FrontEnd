import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { BehaviorSubject, EMPTY, Observable, catchError, tap } from 'rxjs';
import { Lead } from './leads.type';
import { environment } from 'environments/environment';
import { User } from 'app/core/user/user.types';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {
  user:any;
  private readonly getLeadListURL = `${environment.url}/Lead/all`

  private _lead: BehaviorSubject<Lead | null> = new BehaviorSubject(null);
  private _leads: BehaviorSubject<Lead[] | null> = new BehaviorSubject(null);

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
  ) {
    
    this._userService.user$.subscribe(user=>{
      this.user=user;
    })
  }

  //Getter for lead$ Observable
  get lead$(): Observable<Lead> {
    return this._lead.asObservable();
  }
  //Getter for leads$ Observable
  get leads$(): Observable<Lead[]> {
    return this._leads.asObservable();
  }
  setSingleLead(){

  }
  getLeadList(): Observable<Lead[]> {
    let data = {
      id:this.user.id,
      tenantId:this.user.tenantId,
    }
    return this._httpClient.post<Lead[]>(this.getLeadListURL, data).pipe(
      tap((contacts) => {
        this._leads.next(contacts);
      })
    );
  }

}
