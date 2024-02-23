import { Injectable } from '@angular/core';
import { Project } from './project.type';
import { BehaviorSubject, Observable, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { Company } from '../project/project.type';
import { AlertService } from 'app/core/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly getProjectURL = `${environment.url}/Project/all`
  private readonly saveProjectURL = `${environment.url}/Project/save`
  private readonly deleteProjectURL = `${environment.url}/Project/delete`
  private readonly getCompanyURL = `${environment.url}/Company/all`
  user: User
  private _projects: BehaviorSubject < Project[] | null > = new BehaviorSubject(null);
  private _project: BehaviorSubject < Project | null > = new BehaviorSubject(null);
  private _companies: BehaviorSubject < Company[] | null> = new BehaviorSubject(null);
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService,
    private _alertService: AlertService) 
  { 
    this._userService.user$.subscribe(user => this.user = user ) 
  }

  get projects$(): Observable<Project[]>{
    return this._projects.asObservable()
  }
  get project$(): Observable<Project>{
    return this._project.asObservable()
  }
  get companies$(): Observable<Company[]>{
    return this._companies.asObservable()
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
  getCompany(): Observable<Company[]>{
    let data: any = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Company[]>(this.getCompanyURL, data).pipe(
      tap((companies) => {
        this._companies.next(companies);
      }),
      
    )
  }
  saveProject(project: FormGroup): Observable<Project[]>{
    let data: any = {
      projectId: project.value.projectId,
      title: project.value.title,
      companyId: +project.value.companyId,
      code: project.value.code,
      budget: project.value.budget,
      description: project.value.description,
      tenantId: this.user.tenantId,
      id: this.user.id,
    }
    return this._httpClient.post<Project[]>(this.saveProjectURL, data).pipe(
      tap((projects) => {
        this._alertService.showSuccess("Project Saved Successfully");
        this.getProject().subscribe()
      }),
      
    );
  }
  deleteProject(projectId: number): Observable<Project[]>{
    let data: any = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      projectId: +projectId
    }
    return this._httpClient.post<Project[]>(this.deleteProjectURL, data).pipe(
      tap((projects) => {
        this.getProject().subscribe()
      }),
      
    );
  }
  selectedProject(selectedProject: Project){
    this._project.next(selectedProject);
  }
  getProjectById(id: number): Observable<Project> {
    return this._projects.pipe(
      take(1),
      map((projects) => {
        if(id ===  -1) {
          const project = new Project({});
          this._project.next(project);
          return project;
        }
        else {
          const project = projects.find( item => item.projectId === id) || null
          this._project.next(project)
          return project
        }
      }),
      switchMap((project) => {
        if (!project) {
          return throwError('Could not find project with id of ' + id + '!');
        }
        return of(project);
      })
    )
  }
  

}
