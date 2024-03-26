import { Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AssignedCheckList, AssignedCheckPoint } from './execute-checklist.type';
import { User } from 'app/core/user/user.types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExecuteChecklistService {
  private readonly getCheckListUrl = `${environment.url}/CkCheckList/getExecutionCheckList`
  private readonly getCheckPointUrl = `${environment.url}/CkCheckList/getExecutionCheckPoint`
  private readonly saveStatusUrl = `${environment.url}/CkCheckList/saveCheckPointStatus`

  private _checklists: BehaviorSubject<AssignedCheckList[] | null> = new BehaviorSubject([]);
  private _checkpoints: BehaviorSubject<AssignedCheckPoint[] | null> = new BehaviorSubject([]);

  user: User;
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,) 
  {
    this._userService.user$.subscribe(user => {this.user = user;})
  }
  get checkList$(): Observable<AssignedCheckList[]> {
    return this._checklists.asObservable();
  }
  get checkPoint$(): Observable<AssignedCheckPoint[]> {
    return this._checkpoints.asObservable();
  }
  getChecklist(): Observable<AssignedCheckList[]> {
      
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<AssignedCheckList[]>(this.getCheckListUrl, data).pipe(
      tap((checklists) => {
        this._checklists.next(checklists);
      }),
      
    );
  }
  getCheckpoint(execId): Observable<AssignedCheckPoint[]> {
      
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      execId:execId
    }
    return this._httpClient.post<AssignedCheckPoint[]>(this.getCheckPointUrl, data).pipe(
      tap((checkpints) => {
        this._checkpoints.next(checkpints);
      }),
      
    );
  }

  setStatus(statusId:number, executionId:number, checkPointId:number): Observable<AssignedCheckPoint[]> {
      
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      execId:executionId,
      cpId:checkPointId,
      statusId:statusId,
    }
    return this._httpClient.post<AssignedCheckPoint[]>(this.saveStatusUrl, data).pipe(
      tap((checkpints) => {
        this._checkpoints.next(checkpints);
      }),
      
    );
  }
}
