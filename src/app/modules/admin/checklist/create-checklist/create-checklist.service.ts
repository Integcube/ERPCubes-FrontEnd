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
    private readonly getcheckpointURL = `${environment.url}/CkCheckList/getcheckpoint`

    // private readonly deleteDashboardListURL = `${environment.url}/Dashboard/delete`
  
    
  
    private _checklist: BehaviorSubject<Checklist | null> = new BehaviorSubject(null);
    private _checklists: BehaviorSubject<Checklist[] | null> = new BehaviorSubject([]);
    private _checkpoint: BehaviorSubject<CheckPoint[] | null> = new BehaviorSubject([]);

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
    selectedChecklistCheckpoint$ = this.checklist$.pipe(
        switchMap((checklist) => {
          if (checklist.cLId != -1) {
            return this._httpClient.post<CheckPoint[]>(this.getcheckpointURL, {
              id: this.user.id,
              tenantId: this.user.tenantId,
              cLId: checklist.cLId
            }).pipe(
              debounceTime(300),
            )
          }
          else {
            return of([]);
          }
        }),
        
    )

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

      getcheckpoint(clId:number,execId:number): Observable<CheckPoint[]> {
        let data = {
          id: this.user.id,
          tenantId: this.user.tenantId,
          clId:clId,
          execId:execId
        }
        return this._httpClient.post<CheckPoint[]>(this.getcheckpointURL, data).pipe(
          tap((response) => {
            debugger
            this._checkpoint.next(response);
           
          }),
        );
      }

      getChecklistById(id: number): Observable<Checklist> {
        return this._checklists.pipe(
          take(1),
          map((checklists) => {
            if (id == -1) {
              const checklist = new Checklist({});
              this._checklist.next(checklist);
              return checklist
            }
            else {
              const checklist = checklists.find(value => value.cLId === id) || null;
              this._checklist.next(checklist);
              return checklist;
            }
          }),
          switchMap((checklist) => {
            if (!checklist) {
              return throwError('Could not found the checklist with id of ' + id + '!');
            }
            return of(checklist);
          })
        );
      }
    
}
