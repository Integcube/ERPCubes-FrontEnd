import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ExecutedChecklistReport } from './executedchecklist-report.type';

@Injectable({
  providedIn: 'root'
})
export class ExecutedChecklistReportService {
  private readonly getuListURL = `${environment.url}/CkCheckList/executeChecklistReport`

  private _checklistReport: BehaviorSubject<ExecutedChecklistReport[] | null> = new BehaviorSubject(null)
  user: User;
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    ) 
  {
    this._userService.user$.subscribe(user => { this.user = user; })
  }
  get checklistReport$(): Observable<ExecutedChecklistReport[]> {
    return this._checklistReport.asObservable()
  }
  getCheckListReport(startDate: string, endDate: string): Observable<any[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      startDate: startDate,
      endDate: endDate,
    }
    debugger;
    return this._httpClient.post<any[]>(this.getuListURL, data).pipe(
      tap((response) => {
        this._checklistReport.next(response);
       
      }),
    );
  }
}
