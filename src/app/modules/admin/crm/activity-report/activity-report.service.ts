import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { ActivityReport ,LeadStatus,Product,Project,Filter} from './activity-report.type';

@Injectable({
  providedIn: 'root'
})
export class ActivityReportService {
  user: User;
  private readonly getUsersUrl = `${environment.url}/Users/all`
  private readonly getActivityReportUrl = `${environment.url}/UserActivity/activityReport`

  private readonly getLeadStatusUrl = `${environment.url}/Lead/allStatus`
  private readonly getProductUrl = `${environment.url}/Product/all`
  private readonly getProjectURL = `${environment.url}/Project/all`

  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null)
  private _activityReport: BehaviorSubject<ActivityReport[] | null> = new BehaviorSubject(null)
  private _leadStatus: BehaviorSubject<LeadStatus[] | null> = new BehaviorSubject(null)
  private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(null)
  private _projects: BehaviorSubject<Project[] | null> = new BehaviorSubject(null)

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    ) 
  {
    this._userService.user$.subscribe(user => {
        this.user = user;
    })
  }

  get activityReport$(): Observable<ActivityReport[]> {
    return this._activityReport.asObservable()
  }

  get prodcts$(): Observable<Product[]> {
    return this._products.asObservable()
}
get users$(): Observable<User[]> {
    return this._users.asObservable()
}
get leadStatus$(): Observable<LeadStatus[]> {
    return this._leadStatus.asObservable()
}
get project$(): Observable<Project[]> {
    return this._projects.asObservable()
}


  getActivityReport(obj:Filter): Observable<ActivityReport[]> {
   
    obj.tenantId =this.user.tenantId;
    obj.id=this.user.id
    return this._httpClient.post<ActivityReport[]>(this.getActivityReportUrl, obj).pipe(
      tap((activityreport) => {
          this._activityReport.next(activityreport);
      }),
      
    );
  }
  
  getUsers(): Observable<User[]> {
    let data = {
        id: this.user.id,
        tenantId: this.user.tenantId,
    }
    return this._httpClient.post<User[]>(this.getUsersUrl, data).pipe(
        tap((users) => {
            this._users.next(users);
        }),
        
    );
  }

  getProducts(): Observable<Product[]> {
    let data = {
        id: this.user.id,
        tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Product[]>(this.getProductUrl, data).pipe(
        tap((product) => {
         
            this._products.next(product);
        }),
        
    );
}

getLeadStatus(): Observable<LeadStatus[]> {
    let data = {
        id: this.user.id,
        tenantId: this.user.tenantId,
    }
    return this._httpClient.post<LeadStatus[]>(this.getLeadStatusUrl, data).pipe(
        tap((status) => {
            this._leadStatus.next(status);
        }),
        
    );
}

getProject(): Observable<Project[]>{
  let data: any = {
    id: this.user.id,
    tenantId: this.user.tenantId,
  }
  return this._httpClient.post<Project[]>(this.getProjectURL, data).pipe(
    tap((projects) => {
      this._projects.next(projects);
    }),
    
  )
}

  
}
