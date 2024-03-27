import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, combineLatest, debounceTime, forkJoin, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { Pagination, PaginationView, User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { Activity, Call, Email, Industry, Lead, LeadCustomList, LeadFilter, LeadSource, LeadStatus, Note, Product, Tag, TaskModel, Tasks, Meeting, LeadImportList, EventType, Campaign, StatusWiseLeads, DeletedLead, Attachment, Assign } from './lead.type';
import { ContactEnum } from 'app/core/enum/crmEnum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from 'app/core/alert/alert.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ExcelService } from 'app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private readonly getLeadListURL = `${environment.url}/Lead/all`
  private readonly getDeletedLeadsURL = `${environment.url}/Lead/allDeleted`
  private readonly saveLeadURL = `${environment.url}/Lead/save`
  private readonly deleteLeadURL = `${environment.url}/Lead/delete`
  private readonly restoreLeadURL = `${environment.url}/Lead/restore`
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
  private readonly getScoreListUrl = `${environment.url}/Lead/getScoreList`
  private readonly saveleadScoreUrl = `${environment.url}/Lead/saveleadScore`
  private readonly CalculateleadScoreUrl = `${environment.url}/Lead/calculateleadScore`
  private readonly getLeadAttachmentsURL = `${environment.url}/Lead/getLeadAttachments`
  private readonly deleteLeadAttachmentURL = `${environment.url}/DocumentLibrary/delete`
  private readonly downloadFileURL = `${environment.url}/DocumentLibrary/getfile`
  private readonly saveFileURL = `${environment.url}/DocumentLibrary/addLeadFile`
  private readonly bulkdelete = `${environment.url}/Lead/bulkdelete`
  private readonly bulkchangestatusurl = `${environment.url}/Lead/bulkchangestatus`
  private readonly bulkassignleadsUrl = `${environment.url}/Lead/bulkassignleads`
  private readonly getcheckpointURL = `${environment.url}/Lead/getcheckpointss`
  private readonly saveStatusUrl = `${environment.url}/Lead/setstatus`
  

  user: User;
  private _industries: BehaviorSubject<Industry[] | null> = new BehaviorSubject(null);
  private _lead: BehaviorSubject<Lead | null> = new BehaviorSubject(null);
  private _leads: BehaviorSubject<Lead[] | null> = new BehaviorSubject(null);
  private _deletedLeads: BehaviorSubject<DeletedLead[] | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
  private _leadSource: BehaviorSubject<LeadSource[] | null> = new BehaviorSubject(null);
  private _leadStatus: BehaviorSubject<LeadStatus[] | null> = new BehaviorSubject(null);
  private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(null);
  private _notes: BehaviorSubject<Note[] | null> = new BehaviorSubject(null);
  private _note: BehaviorSubject<Note | null> = new BehaviorSubject(null);
  private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
  private _serachQuery: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _tasks: BehaviorSubject<TaskModel[] | null> = new BehaviorSubject(null);
  private _task: BehaviorSubject<TaskModel | null> = new BehaviorSubject(null);
  private _customLists: BehaviorSubject<LeadCustomList[] | null> = new BehaviorSubject(null);
  // private _filter: BehaviorSubject<LeadFilter | null> = new BehaviorSubject(null);
  // private _customList: BehaviorSubject<LeadCustomList | null> = new BehaviorSubject(null);
  private _customList: BehaviorSubject<LeadCustomList | null> = new BehaviorSubject<LeadCustomList | null>(new LeadCustomList({}));
  private _filter: BehaviorSubject<LeadFilter | null> = new BehaviorSubject<LeadFilter | null>(new LeadFilter());

  private _emails: BehaviorSubject<Email[] | null> = new BehaviorSubject(null);
  private _calls: BehaviorSubject<Call[] | null> = new BehaviorSubject(null);
  private _activities: BehaviorSubject<Activity[] | null> = new BehaviorSubject(null);
  private _meetings: BehaviorSubject<Meeting[] | null> = new BehaviorSubject(null);
  private _callreasons: BehaviorSubject<Meeting[] | null> = new BehaviorSubject(null);
  private _eventType: BehaviorSubject<EventType[] | null> = new BehaviorSubject(null);
  private _campaigns: BehaviorSubject<Campaign[] | null> = new BehaviorSubject(null);
  private _statusWiseLeads: BehaviorSubject<StatusWiseLeads[] | null> = new BehaviorSubject(null);
  private _calculateleadScore: BehaviorSubject<any|null> = new BehaviorSubject(null);
  private _leadAttachments: BehaviorSubject<Attachment[] | null> = new BehaviorSubject(null);
  private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);
  private _paginationview: BehaviorSubject<PaginationView | null> = new BehaviorSubject<PaginationView | null>(new PaginationView({}));
  private _selectedLeads: BehaviorSubject<SelectionModel<Lead>> = new BehaviorSubject<SelectionModel<Lead>>(new SelectionModel<Lead>(true, []));
  private _checkpoint: BehaviorSubject<Assign[] | null> = new BehaviorSubject([]);
  private contactEnumInstance: ContactEnum;
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private _alertService: AlertService,
    private _excelService:ExcelService,
    private snackBar: MatSnackBar) {
    this._userService.user$.subscribe(user => { this.user = user; });
 
    this.contactEnumInstance = new ContactEnum();

  }
  HeaderConfig:any[];
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

  get deletedLeads$(): Observable<DeletedLead[]> {
    return this._deletedLeads.asObservable();
  }

  get leadSource$(): Observable<LeadSource[]> {
    return this._leadSource.asObservable();
  }

  get leadStatus$(): Observable<LeadStatus[]> {
    return this._leadStatus.asObservable();
  }

  get leadAttachments$(): Observable<Attachment[]> {
    return this._leadAttachments.asObservable();
  }
  get industries$(): Observable<Industry[]> {
    return this._industries.asObservable();
  }

  get users$(): Observable<User[]> {
    return this._users.asObservable();
  }

  get products$(): Observable<Product[]> {
    return this._products.asObservable();
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
  get calculateleadScore$(): Observable<any> {
    return this._calculateleadScore.asObservable();
  }
  
  get pagination$(): Observable<Pagination>
  {
      return this._pagination.asObservable();
  }

  get selectedLeads$(): Observable<SelectionModel<Lead>> {
    return this._selectedLeads.asObservable();
  }
  updatePaginationParam(pagination:PaginationView){
 
    this._paginationview.next(pagination);
  }

  updateSelectedLeads(selected: SelectionModel<Lead>): void {
    this._selectedLeads.next(selected);
  }
  
  get checkpoint$(): Observable<Assign[]> {
    return this._checkpoint.asObservable();
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
      
    );
  }

  getStatusWiseLeads(): Observable<StatusWiseLeads[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<StatusWiseLeads[]>(this.getStatusWiseLeadsUrl, data).pipe(
      tap((statusWiseLeads) => {
        this._statusWiseLeads.next(statusWiseLeads);
      }),
      
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
      

    );
  }

  getLeads(): Observable<{ paginationVm: Pagination;leadsList: Lead[]}> {
    
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      page: '' + this._paginationview.value.pageIndex,
      size: '' + this._paginationview.value.pageSize,
      sort: this._paginationview.value.active,
      order:this._paginationview.value.direction,
      search:this._paginationview.value.search,
      createdDate: this._customList.value.filterParsed.createdDate,
      leadOwner :this._customList.value.filterParsed.leadOwner,
      modifiedDate :this._customList.value.filterParsed.modifiedDate,
      leadStatus: this._customList.value.filterParsed.leadStatus
    }
    return this._httpClient.post<{ paginationVm: Pagination;leadsList: Lead[]}>(this.getLeadListURL, data).pipe(
      tap((response) => {
        debugger
        this._leads.next(response.leadsList);
        this._pagination.next(response.paginationVm);
      }),
      
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

  getLeadSource(): Observable<LeadSource[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<LeadSource[]>(this.getLeadSourceUrl, data).pipe(
      tap((leadSource) => {
        this._leadSource.next(leadSource);
      }),
      

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
      

    );
  }

  getProduct(): Observable<Product[]> {
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
      

    );
  }

  GetLeadScore(leadId: number): Observable<any[]> {
    let data = {
      leadId: leadId
    }
    return this._httpClient.post<any>(this.CalculateleadScoreUrl, data).pipe(
      tap((calls) => {
        this._calculateleadScore.next(calls);
        let leads = this._leads.value;
        let leadToUpdateIndex = leads.findIndex(a=>a.leadId == leadId);
        leads[leadToUpdateIndex].rating = calls.rating;
        this._leads.next(leads);
      }),
      

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
      
    );
  }

  getLeadAttachments(lead: Lead): Observable<Attachment[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      contactTypeId: this.contactEnumInstance.Lead,
      leadId: lead.leadId
    }
    return this._httpClient.post<Attachment[]>(this.getLeadAttachmentsURL, data)
    .pipe(
      tap((attachment) => {
        this._leadAttachments.next(attachment);
      }),
      
    );
  }

  deleteLeadAttachment(id:number, lead:Lead): Observable<Attachment[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      fileId: id,
      contactTypeId: this.contactEnumInstance.Lead,
      leadId: lead.leadId
    }
    return this._httpClient.post<Attachment[]>(this.deleteLeadAttachmentURL, data)
    .pipe(
      tap(() => {
        this.getLeadAttachments(lead).subscribe();
      }),
      
    );
  }

  downloadFile(path: string): Observable<any> {
    const fullUrl = `${this.downloadFileURL}?filePath=${path}`;
    return this._httpClient.get(fullUrl, {
        responseType: 'blob',
        observe: 'response'
    }).pipe(          
        
    );
  }

  saveFile(file: File, selectedLead: Lead): Observable<Attachment[]> {
    const parentId = 0   
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenantId', this.user.tenantId.toString());
    formData.append('id', this.user.id);
    formData.append('parentId', parentId.toString());
    formData.append('contactTypeId', this.contactEnumInstance.Lead.toString());
    formData.append('leadId', selectedLead.leadId.toString());
    return this._httpClient.post<Attachment[]>(this.saveFileURL, formData).pipe(
      tap(data => {
        this.getLeadAttachments(selectedLead).subscribe();
      }),
      
    );
  }

  selectedLead(selectedLead: Lead) {
    this._lead.next(selectedLead);
  }

  setCustomList(list: LeadCustomList) {
    this._customList.next(list);

  }

  setFilter(filter: LeadFilter) {
    this._filter.next(filter);
    this.getLeads().subscribe();
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
      

    );
  }
  deleteBulkLeads(leadIds: any) {
    let data = {
      id: this.user.id,
      tenantId:this.user.tenantId,
      leads: leadIds,
   
    }
    return this._httpClient.post<Lead[]>(this.bulkdelete, data).pipe(
      tap((company) => {

        this.getLeads().subscribe();
        this._alertService.showSuccess("Selected Leads Deleted");
      }),
      
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
      )
  }

  ChangeBulkLeadStaus(LeadId: any, statusId: number, StausTitle:string) {
    let data = {
      userId: this.user.id,
      tenantId: this.user.tenantId,
      leads: LeadId,
      statusId: statusId,
      stausTitle: StausTitle
    }
    return this._httpClient.post<Lead[]>(this.bulkchangestatusurl, data).pipe(
      tap((company) => {
        this.getLeads().subscribe();
        this._alertService.showSuccess("Leads Status Changed");
      }),
      )
  }
  BulkLeadsAssign(LeadId: any, LeadOwnerId: string) {
    let data = {
      userId: this.user.id,
      tenantId: this.user.tenantId,
      leads: LeadId,
      leadOwner: LeadOwnerId,
    }
    return this._httpClient.post<Lead[]>(this.bulkassignleadsUrl, data).pipe(
      tap((company) => {
        this.getLeads().subscribe();
        this._alertService.showSuccess("Leads Assignd");
      }),
      )
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
        this._alertService.showSuccess("Lead Saved Successfully");
        this.getLeads().subscribe();
      }),
    );
  }

  getDeletedLeads(): Observable<DeletedLead[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<DeletedLead[]>(this.getDeletedLeadsURL, data).pipe(
      tap((leads) => {
        this._deletedLeads.next(leads);
      }),
      
    );
  }

  getScoreList(LeadId: number): Observable<any[]> {
    let data = {
      LeadId: LeadId,
      tenantId: this.user.tenantId,
    };
    return this._httpClient.post<any[]>(this.getScoreListUrl, data).pipe(
      
    );
  }

  restoreLeads(deletedLeads: DeletedLead[]) {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      deletedLeads,
    }
    return this._httpClient.post<Lead[]>(this.restoreLeadURL, data).pipe(
      tap((lead) => {
        this.getLeads().subscribe();
      }),
      
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
      
    );
  }

  saveleadScore(scores: any[], leadId: number): Observable<any> {
   let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      leadId: leadId,
      Leads:scores
    }
    return this._httpClient.post<Call[]>(this.saveleadScoreUrl, data).pipe(
      tap((call) => {
        this.GetLeadScore(leadId).subscribe();
      }),
      
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

  setSelectedLead(leadId:number){
    let leads = this._leads.value;
    const lead = leads.find(item => item.leadId === leadId) || null;
    this._lead.next(lead);
    return lead;
  }

  Export(){
    debugger
    this.HeaderConfig = [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'statusTitle', label: 'Status' },
      { key: 'mobile', label: 'Mobile' },
      { key: 'work', label: 'Work' },
      { key: 'address', label: 'Address' },
      { key: 'street', label: 'Street' },
      { key: 'city', label: 'City' },
      { key: 'zip', label: 'Zip' },
      { key: 'state', label: 'State' },
      { key: 'country', label: 'Country' },
      { key: 'sourceTitle', label: 'Source' },
      { key: 'industryTitle', label: 'Industry' },
      { key: 'productTitle', label: 'Product' },
      { key: 'campaignTitle', label: 'Campaign'},
      { key: 'createdDate', label: 'Created Date' },
      { key: 'modifiedDate', label: 'Modified Date' },
      { key: 'leadOwnerName', label: 'Lead Owner' },
      { key: 'rating', label: 'Rating' },
      { key: 'remarks', label: 'Remarks' }
  ];
    this._excelService.exportToExcel(this._leads.value, this.HeaderConfig, 'Leads.xlsx');
      }

getcheckpoint(leadId:number): Observable<Assign[]> {
  let data = {
    id: this.user.id,
    tenantId: this.user.tenantId,
    contactId:leadId
  }
  return this._httpClient.post<Assign[]>(this.getcheckpointURL, data).pipe(
    tap((response) => {
      this._checkpoint.next(response);
    }),
  );
}

setStatus(statusId:number, cpId:number, contactId:number){  
  let data = {
    id: this.user.id,
    tenantId: this.user.tenantId,
    cpId:cpId,
    contactId:contactId,
    statusId:statusId,
    contactTypeId:1,
  }
  return this._httpClient.post<any[]>(this.saveStatusUrl, data).pipe(
    tap((checkpints) => {

    }), 
  );
}
}

