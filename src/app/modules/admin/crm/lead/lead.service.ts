import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, debounceTime, forkJoin, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { Activity, Call, Email, Industry, Lead, LeadCustomList, LeadFilter, LeadSource, LeadStatus, Note, Product, Tag, TaskModel, Tasks, Meeting, LeadImportList, EventType, Campaign, StatusWiseLeads } from './lead.type';
import { ContactEnum } from 'app/core/enum/crmEnum';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private readonly getEmailsUrl = `${environment.url}/Email/all`
  private readonly getCallsUrl = `${environment.url}/Call/all`
  private readonly getScenariosUrl = `${environment.url}/Call/allscenarios`
  private readonly getMeetingsUrl = `${environment.url}/Meeting/all`
  private readonly getUserActivityListURL = `${environment.url}/UserActivity/Get`
  private readonly saveCustomListUrl = `${environment.url}/CustomList/save`
  private readonly saveCustomListFilterUrl = `${environment.url}/CustomList/saveFilter`
  private readonly saveTaskUrl = `${environment.url}/Task/save`
  private readonly saveEmailsUrl = `${environment.url}/Email/save`
  private readonly saveCallsUrl = `${environment.url}/Call/save`
  private readonly saveMeetingsUrl = `${environment.url}/Meeting/save`
  private readonly saveNotesUrl = `${environment.url}/Notes/save`
  private readonly updateTaskStatusUrl = `${environment.url}/Task/updateStatus`
  private readonly updateTaskPriorityUrl = `${environment.url}/Task/updatePriority`
  private readonly deleteTaskUrl = `${environment.url}/Task/delete`
  private readonly deleteNotesURL = `${environment.url}/Notes/delete`
  private readonly deleteEmailsUrl = `${environment.url}/Email/delete`
  private readonly deleteCallsUrl = `${environment.url}/Call/delete`
  private readonly deleteMeetingsUrl = `${environment.url}/Meeting/delete`
  private readonly deleteCustomListUrl = `${environment.url}/CustomList/delete`
  private readonly changeLeadStatus = `${environment.url}/Lead/ChangeLeadStatus`
  private readonly saveBulkLeadUrl = `${environment.url}/Lead/bulkSave`
  private readonly getEventTypeUrl = `${environment.url}/Calendar/type`
  private readonly getAllCampaignsURL = `${environment.url}/Campaign/all`
  private readonly getStatusWiseLeadsUrl = `${environment.url}/Lead/getStatusWiseLeads`
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
  private _emails: BehaviorSubject<Email[] | null> = new BehaviorSubject(null);
  private _calls: BehaviorSubject<Call[] | null> = new BehaviorSubject(null);
  private _activities: BehaviorSubject<Activity[] | null> = new BehaviorSubject(null);
  private _meetings: BehaviorSubject<Meeting[] | null> = new BehaviorSubject(null);
  private _callreasons: BehaviorSubject<Meeting[] | null> = new BehaviorSubject(null);
  private _eventType: BehaviorSubject<EventType[] | null> = new BehaviorSubject(null);
  private _campaigns: BehaviorSubject<Campaign[] | null> = new BehaviorSubject(null);
  private _statusWiseLeads: BehaviorSubject<StatusWiseLeads[] | null> = new BehaviorSubject(null);

  private contactEnumInstance: ContactEnum;
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private snackBar: MatSnackBar) {
    this._userService.user$.subscribe(user => { this.user = user; });
    this.contactEnumInstance = new ContactEnum();
  }

  filteredLeads$ = combineLatest(
    this.leads$,
    this.filter$)
    .pipe(
      map(([leads, filter]) => {
        return leads.filter(lead => {
          let passFilter = true;
          if (filter.leadOwner.length > 0) {
            passFilter = passFilter && filter.leadOwner.includes(lead.leadOwner);
          }
          if (filter.leadStatus.length > 0) {
            passFilter = passFilter && filter.leadStatus.includes(lead.status);
          }
          if (filter.createdDate) {
            let c = new Date(filter.createdDate);
            passFilter = passFilter && c >= filter.createdDate;
          }
          if (filter.modifiedDate) {
            let d = new Date(filter.modifiedDate);
            passFilter = passFilter && d >= filter.modifiedDate;
          }
          return passFilter;
        })
      })
    )

  selectedNoteTask$ = this.note$
    .pipe(
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
      catchError(err => this.handleError(err))
    )

  selectedNoteTag$ = this.note$
    .pipe(
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
      catchError(err => this.handleError(err))
    )

  selectedTaskTag$ = this.task$
    .pipe(
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
      catchError(err => this.handleError(err))
    )

    get statusWiseLeads$():Observable<StatusWiseLeads[]>{
      return this._statusWiseLeads.asObservable();
    }

  get activities$(): Observable<any> {
    return this._activities.asObservable();
  }

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

  get eventTypes$(): Observable<EventType[]> {
    return this._eventType.asObservable();
  }

  get CallReason$(): Observable<any[]> {
    return this._callreasons.asObservable();
  }

  get calls$(): Observable<Call[]> {
    return this._calls.asObservable();
  }

  get meetings$(): Observable<Meeting[]> {
    return this._meetings.asObservable();
  }

  get emails$(): Observable<Email[]> {
    return this._emails.asObservable();
  }

  get campaigns$(): Observable<Campaign[]> {
    return this._campaigns.asObservable();
  }

  getCampaigns(): Observable<Campaign[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Campaign[]>(this.getAllCampaignsURL, data).pipe(
      tap((campaigns) => {
        this._campaigns.next(campaigns);
      }),
      catchError(err => this.handleError(err))
    );
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
      catchError(err => this.handleError(err))
    );
  }
  getStausWiseLeads(): Observable<StatusWiseLeads[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<StatusWiseLeads[]>(this.getStatusWiseLeadsUrl, data).pipe(
      tap((statusWiseLeads) => {
        this._statusWiseLeads.next(statusWiseLeads);
      }),
      catchError(err => this.handleError(err))
    );
  }
  getTasks(leadId: number): Observable<TaskModel[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId: this.contactEnumInstance.Lead,
      contactId: leadId,
    }
    return this._httpClient.post<TaskModel[]>(this.getLeadTaskUrl, data).pipe(
      tap((tasks) => {
        this._tasks.next(tasks);
      }),
      catchError(err => this.handleError(err))

    );
  }

  getNotes(leadId: number): Observable<Note[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId: this.contactEnumInstance.Lead,
      contactId: leadId,
    }
    return this._httpClient.post<Note[]>(this.getNotesUrl, data).pipe(
      tap((notes) => {
        this._notes.next(notes);
      }),
      catchError(err => this.handleError(err))

    );
  }

  getLeads(): Observable<Lead[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Lead[]>(this.getLeadListURL, data).pipe(
      tap((leads) => {
        this._leads.next(leads); // Update leads BehaviorSubject with the retrieved leads
      }),
      catchError(err => this.handleError(err))
    );
    // return this.filter$.pipe(
    //   switchMap((filter: LeadFilter) => {
    //     const data = {
    //       id: this.user.id,
    //       tenantId: this.user.tenantId,
    //       leadOwner: filter?.leadOwner.join(', ') || "",
    //       createdDate: filter?.createdDate || null,
    //       modifiedDate: filter?.modifiedDate || null,
    //       leadStatus: filter?.leadStatus.join(', ') || "",
    //     };
    //     return this._httpClient.post<Lead[]>(this.getLeadListURL, data).pipe(
    //       tap((leads) => {
    //         this._leads.next(leads); // Update leads BehaviorSubject with the retrieved leads
    //       }),
    //       catchError(error => {
    //         alert(error);
    //         return EMPTY;
    //       })
    //     );
    //   })
    // );
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
      catchError(err => this.handleError(err))
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
      catchError(err => this.handleError(err))

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
      catchError(err => this.handleError(err))

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
      catchError(err => this.handleError(err))

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
      catchError(err => this.handleError(err))

    );
  }

  getMeetings(leadId: number): Observable<Meeting[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId: this.contactEnumInstance.Lead,
      contactId: leadId,
    }
    return this._httpClient.post<Meeting[]>(this.getMeetingsUrl, data).pipe(

      tap((meetings) => {
        this._meetings.next(meetings);
      }),
      catchError(err => this.handleError(err))

    );
  }

  getEmails(leadId: number): Observable<Email[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId: this.contactEnumInstance.Lead,
      contactId: leadId
    }
    return this._httpClient.post<Email[]>(this.getEmailsUrl, data).pipe(
      tap((emails) => {
        this._emails.next(emails);
      }),
      catchError(err => this.handleError(err))
    );
  }
  
  getCalls(leadId: number): Observable<Call[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId: this.contactEnumInstance.Lead,
      contactId: leadId
    }
    return this._httpClient.post<Call[]>(this.getCallsUrl, data).pipe(
      tap((calls) => {
        this._calls.next(calls);
      }),
      catchError(err => this.handleError(err))

    );
  }

  getActivities(count: number, leadId: number): Observable<any> {

    let data = {
      tenantId: this.user.tenantId,
      id: "-1", //this.user.id, 
      count,
      contactTypeId: this.contactEnumInstance.Lead,
      contactId: leadId,
    }
    return this._httpClient.post<Activity[]>(this.getUserActivityListURL, data).pipe(
      tap((response: Activity[]) => {
        this._activities.next(response);
      })
    );
  }

  getScenarios(): Observable<any[]> {
    return this._httpClient.get<any[]>(this.getScenariosUrl).pipe(
      tap((calls) => {
        this._callreasons.next(calls);
      }),
      catchError(err => this.handleError(err))
    );
  }

  getEventType(): Observable<EventType[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<EventType[]>(this.getEventTypeUrl, data).pipe(
      tap((type) => {
        this._eventType.next(type);
      })
    );
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
          debugger
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
          let filter = new LeadFilter();
          if (d.filter) {
            const jsonObject = JSON.parse(d.filter);
            filter = {
              leadOwner: jsonObject.leadOwner && jsonObject.leadOwner.length ? jsonObject.leadOwner : [],
              createdDate: jsonObject?.createdDate,
              modifiedDate: jsonObject?.modifiedDate,
              leadStatus: jsonObject.leadStatus && jsonObject.leadStatus.length ? jsonObject.leadStatus : [],
            };
          }
          return {
            ...d,
            filterParsed: filter
          } as LeadCustomList;
        });
      }),
      tap((customList) => {
        this._customLists.next(customList);
      }),
      catchError(err => this.handleError(err))
    );
  }

  selectedLead(selectedLead: Lead) {
    this._lead.next(selectedLead);
  }

  setCustomList(list: LeadCustomList) {
    this._customList.next(list)
  }

  setFilter(filter: LeadFilter) {
    this._filter.next(filter);
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
      catchError(err => this.handleError(err))
    );
  }

  updateSearchQuery(value: any) {
    this._serachQuery.next(value);
  }

  updateTaskPriority(taskId: number, taskTitle, priority, leadId) {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      taskId,
      taskTitle,
      priority
    }
    return this._httpClient.post<any>(this.updateTaskPriorityUrl, data).pipe(
      tap((customList) => {
        this.getTasks(leadId).subscribe();
      }),
      catchError(err => this.handleError(err))
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
      catchError(err => this.handleError(err))
    );
  }

  deleteNote(noteId: number, leadId: number): Observable<Note> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      noteId: noteId
    }
    return this._httpClient.post<Note>(this.deleteNotesURL, data).pipe(
      tap((note) => {
        this.getNotes(leadId).subscribe();
      }),
      catchError(err => this.handleError(err))
    );
  }

  deleteEmail(emailId: number, leadId: number): Observable<Email> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      emailId: emailId,

    }
    return this._httpClient.post<Email>(this.deleteEmailsUrl, data).pipe(
      tap((customList) => {
        this.getEmails(leadId).subscribe();
      }),
      catchError(err => this.handleError(err))
    );
  }

  deleteCall(callId: number, leadId: number): Observable<Call> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      callId: callId,
      typeId: 1,
    }
    return this._httpClient.post<Call>(this.deleteCallsUrl, data).pipe(
      tap((customList) => {
        this.getCalls(leadId).subscribe();
      }),
      catchError(err => this.handleError(err))
    );
  }

  deleteMeeting(meetingId: number, leadId: number): Observable<Meeting> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      meetingId: meetingId,

    }
    return this._httpClient.post<Meeting>(this.deleteMeetingsUrl, data).pipe(
      tap((customList) => {
        this.getMeetings(leadId).subscribe();
      }),
      catchError(err => this.handleError(err))
    );
  }

  deleteCustomList(leadList: LeadCustomList): Observable<LeadCustomList> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      listId: leadList.listId,
      listTitle: leadList.listTitle,
    }
    return this._httpClient.post<LeadCustomList>(this.deleteCustomListUrl, data).pipe(
      tap((customList) => {
        let list = new LeadCustomList({});
        list.listTitle = "All Leads";
        this.setCustomList(list);
        this.getCustomList().subscribe();
      }),
      catchError(err => this.handleError(err))
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
      catchError(err => this.handleError(err))

    );
  }

  ChangeLeadStatus(LeadId: number, statusId: number, StausTitle) {
    let data = {
      userId: this.user.id,
      tenantId: this.user.tenantId,
      leadId: LeadId,
      statusId: statusId,
      stausTitle: StausTitle
    }
    return this._httpClient.post<Lead[]>(this.changeLeadStatus, data).pipe(
      tap((company) => {
        this.getLeads().subscribe();
      }),
      catchError(err => this.handleError(err)))
  }

  saveNote(note: Note, leadId: number): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      contactTypeId: this.contactEnumInstance.Lead,
      contactId: leadId,
      note: {
        noteId: note.noteId,
        noteTitle: note.noteTitle,
        content: note.content,
        tags: note.tags ? note.tags.map(tag => tag.tagId).join(',') : '',
        tasks: note.tasks
      }
    };
    return this._httpClient.post<Note[]>(this.saveNotesUrl, data).pipe(
      tap(() => {
        this.getNotes(leadId).subscribe();
      }),
      catchError(err => this.handleError(err))
    );
  }

  saveEmail(email: any, leadId: number): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      emailId: email.emailId,
      subject: email.subject,
      description: email.description,
      contactTypeId: this.contactEnumInstance.Lead,
      contactId: leadId,
    }
    return this._httpClient.post<Email[]>(this.saveEmailsUrl, data).pipe(
      tap((email) => {
        this.getEmails(leadId).subscribe();
      }),
      catchError(err => this.handleError(err))
    );
  }

  saveMeeting(meeting: any, leadId: number): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      contactTypeId: this.contactEnumInstance.Lead,
      contactId: leadId,
      meetingId: meeting.meetingId,
      subject: meeting.subject,
      note: meeting.note,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      meetingDate: meeting.meetingDate,
    }
    return this._httpClient.post<Meeting[]>(this.saveMeetingsUrl, data).pipe(
      tap((meeting) => {
        this.getMeetings(leadId).subscribe();
      }),
      catchError(err => this.handleError(err))
    );
  }

  saveLead(lead: Lead) {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      lead,

    }
    return this._httpClient.post<Lead[]>(this.saveLeadURL, data).pipe(
      tap((lead) => {
        this.getLeads().subscribe();
      }),
      catchError(err => this.handleError(err))

    );
  }

  saveCall(call: any, leadId: number): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      callId: call.callId,
      subject: call.subject,
      response: call.response,
      startTime: call.startTime,
      endTime: call.endTime,
      reasonId: call.reasonId,
      dueDate: call.dueDate,
      isTask: call.isTask,
      taskId: call.taskId,
      contactTypeId: this.contactEnumInstance.Lead,
      contactId: leadId,
      callDate:call.callDate,
    }
    return this._httpClient.post<Call[]>(this.saveCallsUrl, data).pipe(
      tap((call) => {
        this.getCalls(leadId).subscribe();
      }),
      catchError(err => this.handleError(err))
    );
  }

  saveCustomList(leadList: LeadCustomList): Observable<LeadCustomList> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      listId: leadList.listId,
      listTitle: leadList.listTitle,
      isPublic: leadList.isPublic,
      type: "Lead"
    }
    return this._httpClient.post<LeadCustomList>(this.saveCustomListUrl, data).pipe(
      map(customList => {
    
        let filter = new LeadFilter();
        if (customList.filter) {
          debugger
          const jsonObject = JSON.parse(customList.filter);
          filter = {
            
            leadOwner: jsonObject.leadOwner,
            createdDate: jsonObject?.createdDate,
            modifiedDate: jsonObject?.modifiedDate,
            leadStatus: jsonObject.leadStatus ,
          };
        }
        return {
          ...customList,
          filterParsed: new LeadFilter()
        }
      }),
      tap((customList) => {
        this.setCustomList(customList)
        this.getCustomList().subscribe();
      }),
      catchError(err => this.handleError(err))
    );
  }

  saveCustomFilter(listId: number, listTitle: string, filter: string): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      listId,
      listTitle,
      filter
    }
    return this._httpClient.post<Lead[]>(this.saveCustomListFilterUrl, data).pipe(
      catchError(err => this.handleError(err))
    );
  }

  saveTask(taskForm, leadId: number): Observable<TaskModel> {
    debugger
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      task: {
        ...taskForm.value,
        priorityId: -1,
        statusId: -1,
        tags: taskForm.value.tags.join(','),
        type: 'task',
        contactTypeId: this.contactEnumInstance.Lead,
        contactId: leadId,
      }
    }
   
    return this._httpClient.post<TaskModel>(this.saveTaskUrl, data).pipe(
      tap((customList) => {
        this.getTasks(leadId).subscribe();
      }),
      catchError(err => this.handleError(err))
    );
  }

  saveBulkLeads(leads: Lead[]) {
    const data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      lead: leads
    };
    return this._httpClient.post<any>(this.saveBulkLeadUrl, data).pipe(
      tap(data => {
      })
    );
  }

  saveBulkImportLeads(leads: LeadImportList[]) {
    const data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      lead: leads
    };
    return this._httpClient.post<any>(this.saveBulkLeadUrl, data).pipe(
      tap(data => {
      })
    );
  }

  createList(list: any): Observable<any> {
    return
  }

  updateList(list): Observable<any> {
    return
  }

  deleteList(id): Observable<any> {
    return
  }

  createCard(card): Observable<any> {
    return
  }

  updateLists(updated): Observable<any> {
    return
  }

  updateCards(updated): Observable<any> {
    return
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    this.showNotification('snackbar-success', errorMessage, 'bottom', 'center');
    return throwError(() => errorMessage);
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}

