import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, debounceTime, forkJoin, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { Activity, Call, Email, Industry, Lead, LeadCustomList, LeadFilter, LeadSource, LeadStatus, Note, Product, Tag, TaskModel, Tasks } from './lead.type';

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
  private readonly getCustomListUrl = `${environment.url}/CustomList/all`
  private readonly deleteTaskUrl = `${environment.url}/Task/delete`
  private readonly saveTaskUrl = `${environment.url}/Task/save`
  private readonly updateTaskStatusUrl = `${environment.url}/Task/updateStatus`
  private readonly getEmailsUrl = `${environment.url}/Email/all`
  private readonly saveEmailsUrl = `${environment.url}/Email/save`
  private readonly getCallsUrl = `${environment.url}/Call/all`
  private readonly saveCallsUrl = `${environment.url}/Call/save`
  private readonly getUserActivityListURL = `${environment.url}/UserActivity/Get`

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
  private _tasks: BehaviorSubject<TaskModel[] | null> = new BehaviorSubject(null);
  private _task: BehaviorSubject<TaskModel | null> = new BehaviorSubject(null);
  private _customLists: BehaviorSubject<LeadCustomList[] | null> = new BehaviorSubject(null);
  private _filter: BehaviorSubject<LeadFilter | null> = new BehaviorSubject(null);
  private _customList: BehaviorSubject<LeadCustomList | null> = new BehaviorSubject(null);
  private _emails:BehaviorSubject<Email[] | null> = new BehaviorSubject(null);
  private _email:BehaviorSubject<Email | null> = new BehaviorSubject(null);
  private _calls:BehaviorSubject<Call[] | null> = new BehaviorSubject(null);
  private _call:BehaviorSubject<Call | null> = new BehaviorSubject(null);
  private _activities: BehaviorSubject<Activity[] | null> = new BehaviorSubject(null);
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
  ) {
    this._userService.user$.subscribe(user => {
      this.user = user;
    })
  }
  filteredLeads$ = combineLatest(
    this.leads$,
    this.filter$
  ).pipe(
    map(([leads, filter])=>{
      return leads.filter(lead=>{
        let passFilter = true;
      if (filter.leadOwner.length > 0) {
        passFilter = passFilter && filter.leadOwner.includes(lead.leadOwner);
      }
      if (filter.leadStatus.length > 0) {
        passFilter = passFilter && filter.leadStatus.includes(lead.status);
      }
      if (filter.createdDate) {
        passFilter = passFilter && lead.createdDate >= filter.createdDate;
      }
      if (filter.modifiedDate) {
        passFilter = passFilter && lead.modifiedDate >= filter.modifiedDate;
      }
      return passFilter;
      })
    })
  )
  updateSearchQuery(value: any) {
    this._serachQuery.next(value);
  }
  get activities$(): Observable<any>
  {
      return this._activities.asObservable();
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
  get filter$(): Observable<LeadFilter> {
    return this._filter.asObservable();
  }
  get customLists$(): Observable<LeadCustomList[]> {
    return this._customLists.asObservable();
  }
  get customList$(): Observable<LeadCustomList> {
    return this._customList.asObservable();
  }
  get searchQuery$(): Observable<any> {
    return this._serachQuery.asObservable();
  }
  get tasks$(): Observable<TaskModel[]> {
    return this._tasks.asObservable();
  }
  get task$(): Observable<TaskModel> {
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
  get call$(): Observable<Call> {
    return this._call.asObservable();
  }
  get calls$(): Observable<Call[]> {
    return this._calls.asObservable();
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
  getTasks(leadId: number): Observable<TaskModel[]> {
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
  setFilter(filter: LeadFilter) {
    this._filter.next(filter);
  }
  getLeads(): Observable<Lead[]> {
    return this.filter$.pipe(
      switchMap((filter: LeadFilter) => {
        debugger;
        const data = {
          id: this.user.id,
          tenantId: this.user.tenantId,
          leadOwner: filter?.leadOwner.join(', ') || "",
          createdDate: filter?.createdDate || null,
          modifiedDate: filter?.modifiedDate || null,
          leadStatus: filter?.leadStatus.join(', ') || "",
        };

        return this._httpClient.post<Lead[]>(this.getLeadListURL, data).pipe(
          tap((leads) => {
            this._leads.next(leads); // Update leads BehaviorSubject with the retrieved leads
          }),
          catchError(error => {
            alert(error);
            return EMPTY;
          })
        );
      })
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
  getCustomList(): Observable<LeadCustomList[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      type: "Lead"
    };
    return this._httpClient.post<LeadCustomList[]>(this.getCustomListUrl, data).pipe(
      map(data => {
        return data.map(d => {
          const jsonObject = JSON.parse(d.filter);
          let filter: LeadFilter = {
            leadOwner: jsonObject.leadOwner && jsonObject.leadOwner.length ? jsonObject.leadOwner.split(', ') : [],
            createdDate: jsonObject?.createdDate,
            modifiedDate: jsonObject?.modifiedDate, 
            leadStatus: jsonObject.leadStatus && jsonObject.leadStatus.length ? jsonObject.leadStatus.split(', ').map(Number) : [],
          };
          return {
            ...d,
            filterParsed: filter
          } as LeadCustomList;
        });
      }),
      tap((customList) => {
        this._customLists.next(customList);
      }),
      catchError(error => { alert(error); return EMPTY; })
    );
  }
  setCustomList(list: LeadCustomList) {
    this._customList.next(list)
  }
  updateTaskStatus(taskId: number, taskTitle, status, leadId): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      taskId,
      taskTitle,
      status
    }
    return this._httpClient.post<any>(this.updateTaskStatusUrl, data).pipe(
      tap((customList) => {
        this.getTasks(leadId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  deleteTask(taskId: number, taskTitle: string, leadId: number): Observable<TaskModel> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      taskId: taskId,
      taskTitle: taskTitle
    }
    return this._httpClient.post<TaskModel>(this.deleteTaskUrl, data).pipe(
      tap((customList) => {
        this.getTasks(leadId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  saveTask(taskForm, leadId: number): Observable<TaskModel> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      companyId: -1,
      leadId: leadId,
      task: {
        ...taskForm.value,
        priorityId: -1,
        statusId: -1,
        tags: taskForm.value.tags.join(',')
      }
    }
    return this._httpClient.post<TaskModel>(this.saveTaskUrl, data).pipe(
      tap((customList) => {
        this.getTasks(leadId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  deleteNote() {
  }
  saveNote() {
  }
  saveEmail(email: any, leadId: number): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      companyId: -1,
      leadId: leadId,
      emailId: email.emailId,
      subject: email.subject,
      description: email.description
    }
    return this._httpClient.post<Email[]>(this.saveEmailsUrl, data).pipe(
      tap((email) => {
        this.getEmails(leadId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  get emails$(): Observable<Email[]> {
    return this._emails.asObservable();
  }
  getEmails(leadId: number): Observable<Email[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      companyId: -1,
      leadId
    }
    return this._httpClient.post<Email[]>(this.getEmailsUrl, data).pipe(
      tap((emails) => {
        this._emails.next(emails);
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  getCalls(leadId: number): Observable<Call[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      companyId: -1,
      leadId
    }
    return this._httpClient.post<Call[]>(this.getCallsUrl, data).pipe(
      tap((calls) => {
        this._calls.next(calls);
      }),
      catchError(error => { alert(error); return EMPTY })

    );
  }

  getActivities(count:number, leadId:number): Observable<any>
  {
      let data = {
          tenantId: this.user.tenantId,
          id: this.user.id,
          count,
          leadId,
          companyId:-1,
      }
      return this._httpClient.post<Activity[]>(this.getUserActivityListURL, data).pipe(
          tap((response: Activity[]) => {
              this._activities.next(response);
          })
      );
  }
}
