import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, debounceTime, forkJoin, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { Industry, Lead, LeadSource, LeadStatus, Note, Product, Tag, TaskModel, Tasks } from './lead.type';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  private readonly getLeadListURL = `${environment.url}/Lead/all`
  private readonly saveLeadURL = `${environment.url}/Lead/save`
  private readonly deleteLeadURL = `${environment.url}/Lead/delete`
  private readonly getIndustriesURL = `${environment.url}/Industry/all`
  private readonly getUsersUrl = `${environment.url}/Users/all`
  private readonly getLeadSourceUrl = `${environment.url}/Lead/allSource`
  private readonly getLeadStatusUrl = `${environment.url}/Lead/allStatus`
  private readonly getProductUrl = `${environment.url}/Product/all`
  private readonly getNotesUrl = `${environment.url}/Notes/all`
  private readonly getTagsUrl = `${environment.url}/Notes/tags`
  private readonly allTagsUrl = `${environment.url}/Tags/all`
  private readonly getTaskUrl = `${environment.url}/Notes/tasks`
  private readonly getLeadTaskUrl = `${environment.url}/Task/all`
  private readonly getTaskTagsUrl = `${environment.url}/Task/tags`

  user: User;

  private _industries: BehaviorSubject<Industry[] | null> = new BehaviorSubject(null);
  private _lead: BehaviorSubject<Lead | null> = new BehaviorSubject(null);
  private _leads: BehaviorSubject<Lead[] | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
  private _leadSource: BehaviorSubject<LeadSource[] | null> = new BehaviorSubject(null);
  private _leadStatus: BehaviorSubject<LeadStatus[] | null> = new BehaviorSubject(null);
  private _product: BehaviorSubject<Product[] | null> = new BehaviorSubject(null);
  private _notes: BehaviorSubject<Note[] | null> = new BehaviorSubject(null);
  private _note: BehaviorSubject<Note | null> = new BehaviorSubject(null);
  private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
  private _serachQuery: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _tasks:BehaviorSubject<TaskModel[] | null> = new BehaviorSubject(null);
  private _task:BehaviorSubject<TaskModel | null> = new BehaviorSubject(null);

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
  ) {
    this._userService.user$.subscribe(user => {
      this.user = user;
    })
  }
  updateSearchQuery(value:any){
    this._serachQuery.next(value);
  }
  selectedNoteTask$ = this.note$.pipe(
    switchMap((note) => {
      if (note.noteId != -1) {
        return this._httpClient.post<Tasks[]>(this.getTaskUrl, {
          id: this.user.id,
          tenantId: this.user.tenantId,
          noteId: note.noteId
        }).pipe(
          debounceTime(300),
        )
      }
      else {
        return of([]);
      }
    }),
    catchError(error => { alert(error); return EMPTY })
  )
  selectedNoteTag$ = this.note$.pipe(
    switchMap((note) => {
      if (note.noteId != -1) {
        return this._httpClient.post<Tag[]>(this.getTagsUrl, {
          id: this.user.id,
          tenantId: this.user.tenantId, noteId: note.noteId
        }).pipe(
          debounceTime(300),
        )
      }
      else {
        return of([]);
      }
    })
    ,
    catchError(error => { alert(error); return EMPTY })
  )
  selectedTaskTag$ = this.task$.pipe(
    switchMap((task) => {
      if (task.taskId != -1) {
        return this._httpClient.post<Tag[]>(this.getTaskTagsUrl, {
          id: this.user.id,
          tenantId: this.user.tenantId, taskId: task.taskId
        }).pipe(
          debounceTime(300),
        )
      }
      else {
        return this.tags$;
      }
    })
    ,
    catchError(error => { alert(error); return EMPTY })
  )
  get searchQuery$():Observable<any>{
    return this._serachQuery.asObservable();
  }
  get tasks$():Observable<TaskModel[]>{
    return this._tasks.asObservable();
  }
  get task$():Observable<TaskModel>{
    return this._task.asObservable();
  }
  get notes$(): Observable<Note[]> {
    return this._notes.asObservable();
  }
  get note$(): Observable<Note> {
    return this._note.asObservable();
  }
  get tags$(): Observable<Tag[]> {
    return this._tags.asObservable();
  }
  get lead$(): Observable<Lead> {
    return this._lead.asObservable();
  }
  get leads$(): Observable<Lead[]> {
    return this._leads.asObservable();
  }
  get leadSource$(): Observable<LeadSource[]> {
    return this._leadSource.asObservable();
  }
  get leadStatus$(): Observable<LeadStatus[]> {
    return this._leadStatus.asObservable();
  }
  get industries$(): Observable<Industry[]> {
    return this._industries.asObservable();
  }
  get users$(): Observable<User[]> {
    return this._users.asObservable();
  }
  get product$(): Observable<Product[]> {
    return this._product.asObservable();
  }
  getTags(): Observable<Tag[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Tag[]>(this.allTagsUrl, data).pipe(
      tap((tags) => {
        this._tags.next(tags);
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  getTasks(leadId: number):Observable<TaskModel[]>{
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      companyId: -1,
      leadId
    }
    return this._httpClient.post<TaskModel[]>(this.getLeadTaskUrl, data).pipe(
      tap((tasks) => {
        this._tasks.next(tasks);
      }),
      catchError(error => { alert(error); return EMPTY })

    );
  }
  getNotes(leadId: number): Observable<Note[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      companyId: -1,
      leadId
    }
    return this._httpClient.post<Note[]>(this.getNotesUrl, data).pipe(
      tap((notes) => {
        this._notes.next(notes);
      }),
      catchError(error => { alert(error); return EMPTY })

    );
  }
  getLeads(): Observable<Lead[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Lead[]>(this.getLeadListURL, data).pipe(
      tap((leads) => {
        this._leads.next(leads);
      }),
      catchError(error => { alert(error); return EMPTY })

    );
  }
  getIndustries(): Observable<Industry[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Industry[]>(this.getIndustriesURL, data).pipe(
      tap((industries) => {
        this._industries.next(industries);
      }),
      catchError(error => { alert(error); return EMPTY })

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
      catchError(error => { alert(error); return EMPTY })

    );
  }
  getLeadSource(): Observable<LeadSource[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<LeadSource[]>(this.getLeadSourceUrl, data).pipe(
      tap((leadSource) => {
        this._leadSource.next(leadSource);
      }),
      catchError(error => { alert(error); return EMPTY })

    );
  }
  getLeadStatus(): Observable<LeadStatus[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<LeadStatus[]>(this.getLeadStatusUrl, data).pipe(
      tap((leadStatus) => {
        this._leadStatus.next(leadStatus);
      }),
      catchError(error => { alert(error); return EMPTY })

    );
  }
  getProduct(): Observable<Product[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Product[]>(this.getProductUrl, data).pipe(
      tap((product) => {
        this._product.next(product);
      }),
      catchError(error => { alert(error); return EMPTY })

    );
  }
  saveLead(lead: Lead) {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      lead
    }
    return this._httpClient.post<Lead[]>(this.saveLeadURL, data).pipe(
      tap((lead) => {
        this.getLeads().subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })

    );
  }
  deleteLead(lead: Lead) {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      leadId: lead.leadId,
      name: lead.firstName + "" + lead.lastName,
    }
    return this._httpClient.post<Lead[]>(this.deleteLeadURL, data).pipe(
      tap((company) => {
        this.getLeads().subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })

    );
  }
  selectedLead(selectedLead: Lead) {
    this._lead.next(selectedLead);
  }
  getLeadById(id: number): Observable<Lead> {
    return this._leads.pipe(
      take(1),
      map((leads) => {
        if (id === -1) {
          const lead = new Lead({});
          this._lead.next(lead);
          return lead;
        }
        else {
          const lead = leads.find(item => item.leadId === id) || null;
          this._lead.next(lead);
          return lead;
        }
      }),
      switchMap((lead) => {
        if (!lead) {
          return throwError('Could not found Lead with id of ' + id + '!');
        }
        return of(lead);
      })
    );
  }
  getNoteById(id: number): Observable<Note> {
    return this._notes.pipe(
      take(1),
      map((notes) => {
        if (id == -1) {
          const note = new Note({});
          this._note.next(note);
          return note
        }
        else {
          const note = notes.find(value => value.noteId === id) || null;
          this._note.next(note);
          return note;
        }
      }),
      switchMap((note) => {
        if (!note) {
          return throwError('Could not found the note with id of ' + id + '!');
        }
        return of(note);
      })
    );
  }
  getTaskById(id: number): Observable<TaskModel> {
    return this._tasks.pipe(
      take(1),
      map((tasks) => {
        if (id == -1) {
          const task = new TaskModel({});
          this._task.next(task);
          return task
        }
        else {
          const task = tasks.find(value => value.taskId === id) || null;
          this._task.next(task);
          return task;
        }
      }),
      switchMap((task) => {
        if (!task) {
          return throwError('Could not found the task with id of ' + id + '!');
        }
        return of(task);
      })
    );
  }
  deleteTask(){

  }
  saveTask(){

  }
  deleteNote(){

  }
  saveNote(){
    
  }
}
