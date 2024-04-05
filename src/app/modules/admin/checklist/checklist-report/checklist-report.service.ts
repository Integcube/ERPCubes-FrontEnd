import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ChecklistReport, ChecklistReportFilter } from './checklist-report.type';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChecklistReporttService {
  private readonly getuListURL = `${environment.url}/CkCheckList/checklistReport`

  private _checklistReport: BehaviorSubject<ChecklistReport[] | null> = new BehaviorSubject(null)
  user: User;
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    ) 
  {
    this._userService.user$.subscribe(user => { this.user = user; })
  }
  get checklistReport$(): Observable<ChecklistReport[]> {
    return this._checklistReport.asObservable()
  }
  getCheckListReport(obj:ChecklistReportFilter): Observable<any[]> {
    obj.tenantId =this.user.tenantId;
    obj.id= this.user.id;
    debugger;
    return this._httpClient.post<any[]>(this.getuListURL, obj).pipe(
      tap((response) => {
        this._checklistReport.next(response);
       
      }),
    );
  }
}
