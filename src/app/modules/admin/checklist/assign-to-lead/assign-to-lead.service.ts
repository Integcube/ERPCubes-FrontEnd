import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, debounceTime, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { CheckPoint, Checklist } from './assign-to-lead.type';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/core/alert/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreateChecklistService {

    private readonly getChecklistURL = `${environment.url}/CkCheckList/all`
    private readonly assigntolead = `${environment.url}/CkCheckList/assignTolead`
    private readonly unAssigntolead = `${environment.url}/CkCheckList/deleteAssignedChecklist`

    
    // private readonly deleteDashboardListURL = `${environment.url}/Dashboard/delete`
  
    
  
    private _checklist: BehaviorSubject<Checklist | null> = new BehaviorSubject(null);
    private _checkList: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _checklists: BehaviorSubject<any[] | null> = new BehaviorSubject([]);

    user: User;
    constructor(
      private _userService: UserService,
      private _alertService: AlertService,
      private _httpClient: HttpClient,
      private snackBar: MatSnackBar) 
    {
      this._userService.user$.subscribe(user => {this.user = user;})
    }
    get checklist$(): Observable<Checklist> {
      return this._checklist.asObservable();
    }
    get checklists$(): Observable<Checklist[]> {
      return this._checklists.asObservable();
    }
    get CheckList$(): Observable<any[]> {
        return this._checkList.asObservable();
      }

    selectedChecklist(selectedChecklist: Checklist) {
      this._checklist.next(selectedChecklist);
    }
  
    getChecklist(): Observable<Checklist[]> {
      
      let data = {
        id: this.user.id,
        tenantId: this.user.tenantId,
      }
      return this._httpClient.post<Checklist[]>(this.getChecklistURL, data).pipe(
        tap((checklists) => {
          this._checklists.next(checklists);
        }),
        
      );
    }

      assignCheckPointToLeads(form: any) {
        let data = {
          id: this.user.id,
          tenantId: this.user.tenantId,
          cLId:form.clId,
          iAssign:form.iAssign
        }
        return this._httpClient.post<any>(this.assigntolead, data).pipe(
          tap((data) => {
            this._alertService.showSuccess("CheckList Assigned Successfully to Leads");
          
          }),
        );
      }
      unAssignCheckPointToLeads(form: any) {
        let data = {
          id: this.user.id,
          tenantId: this.user.tenantId,
          cLId:form.clId,
          remarks:form.remarks,
        } 
        return this._httpClient.post<any>(this.unAssigntolead, data).pipe(
          tap((data) => {
            this._alertService.showError("CheckList Unassigned Successfully to Leads");
          
          }),
        );
      }

      
    
}
