import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
    // private readonly deleteDashboardListURL = `${environment.url}/Dashboard/delete`
  
    
  
    private _checklist: BehaviorSubject<Checklist | null> = new BehaviorSubject(null);
    private _checklists: BehaviorSubject<Checklist[] | null> = new BehaviorSubject([]);
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

    saveChecklist(checklist: Checklist): Observable<any> {
        debugger;
        let data = {
          id: this.user.id,
          tenantId: this.user.tenantId,

          checklist: {
            cLId: checklist.cLId,
            title: checklist.title,
            description: checklist.description,
            checkpoints: checklist.checkpoints
          }

        };
        return this._httpClient.post<Checklist[]>(this.saveChecklistURL, data).pipe(
          tap(() => {
            this.getChecklist().subscribe();
          }),
          
        );
      }


    
}
