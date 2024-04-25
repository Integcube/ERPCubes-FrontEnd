import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, debounceTime, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { CheckPoint, Checklist } from './create-checklist.type';
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
    private readonly saveChecklistURL = `${environment.url}/CkCheckList/save`
    private readonly updatePriorityListURL = `${environment.url}/CkCheckList/updateCheckPointPriority`
    private readonly getcheckpointURL = `${environment.url}/CkCheckList/getcheckpoints`
    private readonly getcheckListURL = `${environment.url}/CkCheckList/getchecklist`
    private readonly deletecheckListURL = `${environment.url}/CkCheckList/deleteChecklist`
    private readonly assigntolead = `${environment.url}/CkCheckList/assignTolead`
    private readonly getchecklistbyIdURL = `${environment.url}/CkCheckList/getcreatechecklistbyId`
    private _checklist: BehaviorSubject<Checklist | null> = new BehaviorSubject(null);
    private _checkList: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _checklists: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
    private _checkpoint: BehaviorSubject<CheckPoint[] | null> = new BehaviorSubject([]);
    private _selectedCheckList: BehaviorSubject<Checklist | null> = new BehaviorSubject(null);

    
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
    get Checkpoint$(): Observable<CheckPoint[]> {
        return this._checkpoint.asObservable();
    }
    get CheckList$(): Observable<any[]> {
        return this._checkList.asObservable();
      }

    selectedChecklist(selectedChecklist: Checklist) {
      this._checklist.next(selectedChecklist);
    }
  
    get selectedCheckList$(): Observable<Checklist> {
      return this._selectedCheckList.asObservable();
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

    saveChecklist(checklist: Checklist): Observable<any> {
        let data = {
          id: this.user.id,
          tenantId: this.user.tenantId,

          checklist: {
            clId: checklist.clId,
            title: checklist.title,
            description: checklist.description,
            checkpoints: checklist.checkpoints,

          }

        };
        return this._httpClient.post<Checklist[]>(this.saveChecklistURL, data).pipe(
          tap(() => {
            this.getChecklist().subscribe();
          }),
          
        );
      }

      getcheckpoint(cLId:number): Observable<CheckPoint[]> {
        let data = {
          id: this.user.id,
          tenantId: this.user.tenantId,
          cLId:cLId,
        }
        return this._httpClient.post<CheckPoint[]>(this.getcheckpointURL, data).pipe(
          tap((response) => {
            this._checkpoint.next(response);
           
          }),
        );
      }
      deleteChecklist(clId: number): Observable<Checklist> {
        let data = {
          id: this.user.id,
          clId: clId
        }
        return this._httpClient.post<Checklist>(this.deletecheckListURL, data).pipe(
          tap((checklist) => {
            this.getChecklist().subscribe();
          }),
          
        );
      }
      assignCheckPointToLeads(form: any) {
        let data = {
          id: this.user.id,
          tenantId: this.user.tenantId,
          cLId:form.clId,
          remarks:form.remarks,
        }
        return this._httpClient.post<any>(this.assigntolead, data).pipe(
          tap((data) => {
            this._alertService.showSuccess("CheckList Assigned Successfully to Leads");
          
          }),
        );
      }

      getCheckListInfo(clId:number): Observable<Checklist> {
        let data = {
          id: this.user.id,
          tenantId: this.user.tenantId,
          clId:clId
        }
        return this._httpClient.post<Checklist>(this.getchecklistbyIdURL, data).pipe(
          tap((response) => {
            response = response==null?new Checklist({}):response;
            this._selectedCheckList.next(response);
          }),
        );
      }
      
    
}
