import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, EMPTY, Observable, combineLatest, debounceTime, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { Activity, Call, Email, Industry, Meeting, Note, Opportunity, OpportunityCustomList, OpportunityFilter, OpportunitySource, OpportunityStatus, Product, Tag, TaskModel } from './opportunity.types';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactEnum } from 'app/core/enum/crmEnum';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {
  private readonly getOpportunityURL = `${environment.url}/Opportunity/all`
  private readonly saveOpportunityURL = `${environment.url}/Opportunity/save`
  private readonly deleteOpportunityURL = `${environment.url}/Opportunity/delete`
  private readonly getOpportunitySourceURL = `${environment.url}/Opportunity/allSource`
  private readonly getOpportunityTaskUrl = `${environment.url}/Task/all`
  private readonly getOpportunityStatusUrl = `${environment.url}/Opportunity/allStatus`
  private readonly getMeetingsUrl = `${environment.url}/Meeting/all`
  private readonly saveMeetingsUrl = `${environment.url}/Meeting/save`
  private readonly deleteMeetingsUrl = `${environment.url}/Meeting/delete`
  private readonly getEmailsUrl = `${environment.url}/Email/all`
  private readonly saveEmailsUrl = `${environment.url}/Email/save`
  private readonly deleteEmailsUrl = `${environment.url}/Email/delete`
  private readonly getNotesUrl = `${environment.url}/Notes/all`
  private readonly saveNotesUrl = `${environment.url}/Notes/save`
  private readonly deleteNotesURL = `${environment.url}/Notes/delete`
  private readonly getNoteTaskUrl = `${environment.url}/Notes/tasks`
  private readonly getNoteTagsUrl = `${environment.url}/Notes/tags`
  private readonly getCallsUrl = `${environment.url}/Call/all`
  private readonly saveCallsUrl = `${environment.url}/Call/save`
  private readonly deleteCallsUrl = `${environment.url}/Call/delete`
  private readonly getTaskTagsUrl = `${environment.url}/Task/tags`
  private readonly saveTaskUrl = `${environment.url}/Task/save`
  private readonly deleteTaskUrl = `${environment.url}/Task/delete`
  private readonly updateTaskStatusUrl = `${environment.url}/Task/updateStatus`
  private readonly updateTaskPriorityUrl = `${environment.url}/Task/updatePriority`
  private readonly getCustomListUrl = `${environment.url}/CustomList/all`
  private readonly saveCustomListUrl = `${environment.url}/CustomList/save`
  private readonly deleteCustomListUrl = `${environment.url}/CustomList/delete`
  private readonly saveCustomListFilterUrl = `${environment.url}/CustomList/saveFilter`
  private readonly getUserActivityListURL = `${environment.url}/UserActivity/Get`
  private readonly getTagsUrl = `${environment.url}/Tags/all`
  private readonly getIndustriesURL = `${environment.url}/Industry/all`
  private readonly getUsersUrl = `${environment.url}/Users/all`
  private readonly getProductUrl = `${environment.url}/Product/all`
  private _opportunityList: BehaviorSubject<Opportunity[] | null> = new BehaviorSubject(null);
  private _opportunity: BehaviorSubject<Opportunity | null> = new BehaviorSubject(null);
  private _opportunitySource: BehaviorSubject<OpportunitySource[] | null> = new BehaviorSubject(null);
  private _opportunityStatus: BehaviorSubject<OpportunityStatus[] | null> = new BehaviorSubject(null);
  private _tasks: BehaviorSubject<TaskModel[] | null> = new BehaviorSubject(null);
  private _task: BehaviorSubject<TaskModel | null> = new BehaviorSubject(null);
  private _emails: BehaviorSubject<Email[] | null> = new BehaviorSubject(null);
  private _calls: BehaviorSubject<Call[] | null> = new BehaviorSubject(null);
  private _meetings: BehaviorSubject<Meeting[] | null> = new BehaviorSubject(null);
  private _notes: BehaviorSubject<Note[] | null> = new BehaviorSubject(null);
  private _note: BehaviorSubject<Note | null> = new BehaviorSubject(null);
  private _industries: BehaviorSubject<Industry[] | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
  private _product: BehaviorSubject<Product[] | null> = new BehaviorSubject(null);
  private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
  private _searchQuery: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _customLists: BehaviorSubject<OpportunityCustomList[] | null> = new BehaviorSubject(null);
  private _customList: BehaviorSubject<OpportunityCustomList | null> = new BehaviorSubject(null);
  private _filter: BehaviorSubject<OpportunityFilter | null> = new BehaviorSubject(null);
  private _activities: BehaviorSubject<Activity[] | null> = new BehaviorSubject(null);
  private contactEnumInstance: ContactEnum;
  user: User
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService,
    
  )
  { this._userService.user$.subscribe(user =>
      this.user = user
    )
    this.contactEnumInstance = new ContactEnum();

  }
  get opportunityList$(): Observable<Opportunity[]> {
    return this._opportunityList.asObservable();
  }
  get opportunity$(): Observable<Opportunity> {
    return this._opportunity.asObservable();
  }
  get opportunitySource$(): Observable<OpportunitySource[]> {
    return this._opportunitySource.asObservable();
  }
  get opportunityStatus$(): Observable<OpportunityStatus[]> {
    return this._opportunityStatus.asObservable();
  }
  get filter$(): Observable<OpportunityFilter> {
    return this._filter.asObservable();
  }
  get customLists$(): Observable<OpportunityCustomList[]> {
    return this._customLists.asObservable();
  }
  get customList$(): Observable<OpportunityCustomList> {
    return this._customList.asObservable();
  }
  get tasks$(): Observable<TaskModel[]> {
    return this._tasks.asObservable();
  }
  get task$(): Observable<TaskModel> {
    return this._task.asObservable();
  }
  get calls$(): Observable<Call[]> {
    return this._calls.asObservable();
  }
  get meetings$(): Observable<Meeting[]> {
    return this._meetings.asObservable();
  }
  get notes$(): Observable<Note[]> {
    return this._notes.asObservable();
  }
  get note$(): Observable<Note> {
    return this._note.asObservable();
  }
  get users$(): Observable<User[]> {
    return this._users.asObservable();
  }
  get searchQuery$(): Observable<any> {
    return this._searchQuery.asObservable();
  }
  get tags$(): Observable<Tag[]> {
    return this._tags.asObservable();
  }
  get industries$(): Observable<Industry[]> {
    return this._industries.asObservable();
  }
  get product$(): Observable<Product[]> {
    return this._product.asObservable();
  }
  get activities$(): Observable<any> {
    return this._activities.asObservable();
  }
  get emails$(): Observable<Email[]> {
    return this._emails.asObservable();
  }
  selectedNoteTask$ = this.note$.pipe(
    switchMap((note) => {
      if (note.noteId != -1) {
        return this._httpClient.post<Task[]>(this.getNoteTaskUrl, {
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
  selectedNoteTag$ = this.note$.pipe(
    switchMap((note) => {
      if (note.noteId != -1) {
        return this._httpClient.post<Tag[]>(this.getNoteTagsUrl, {
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
    
  )
  filteredOpportunityList$ = combineLatest(
    this.opportunityList$,
    this.filter$
  ).pipe(
    map(([opportunityList, filter]) => {
      return opportunityList.filter(opportunity => {
        let passFilter = true;
        if (filter.opportunityOwner.length > 0) {
          passFilter = passFilter && filter.opportunityOwner.includes(opportunity.opportunityOwner);
        }
        if (filter.opportunityStatus.length > 0) {
          passFilter = passFilter && filter.opportunityStatus.includes(opportunity.statusId);
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
  getOpportunity(): Observable<Opportunity[]>{
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Opportunity[]>(this.getOpportunityURL, data).pipe(
      tap((opportunity) => {
        this._opportunityList.next(opportunity)
      }),
      
    )
  }
  getOpportunitySource(): Observable<OpportunitySource[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId
    }
    return this._httpClient.post<OpportunitySource[]>(this.getOpportunitySourceURL, data).pipe(
      tap((source) => {
        this._opportunitySource.next(source)
      }),
      
    )
  }
  getOpportunityStatus(): Observable<OpportunityStatus[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<OpportunityStatus[]>(this.getOpportunityStatusUrl, data).pipe(
      tap((opportunityStatus) => {
        this._opportunityStatus.next(opportunityStatus);
      }),
      

    );
  }
  getOpportunityId(id: number): Observable<Opportunity> {
    return this._opportunityList.pipe(
      take(1),
      map((opportunityList) => {
        if (id === -1) {
          const opportunity = new Opportunity({});
          this._opportunity.next(opportunity);
          return opportunity;
        }
        else {
          const opportunity = opportunityList.find(item => item.opportunityId === id) || null;
          this._opportunity.next(opportunity);
          return opportunity;
        }
      }),
      switchMap((opportunity) => {
        if (!opportunity) {
          return throwError('Could not find opportunity with id of ' + id + '!');
        }
        return of(opportunity);
      })
    );
  }
  getTasks(opportunityId: number): Observable<TaskModel[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Opportunity,
      contactId:opportunityId
    }
    return this._httpClient.post<TaskModel[]>(this.getOpportunityTaskUrl, data).pipe(
      tap((tasks) => {
        this._tasks.next(tasks);
      }),
      

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
  getNotes(opportunityId: number): Observable<Note[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Opportunity,
      contactId:opportunityId
    }
    
    return this._httpClient.post<Note[]>(this.getNotesUrl, data).pipe(
      tap((notes) => {
        this._notes.next(notes);
        
      }),
      

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
  getMeetings(opportunityId: number): Observable<Meeting[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Opportunity,
      contactId:opportunityId
    }
    return this._httpClient.post<Meeting[]>(this.getMeetingsUrl, data).pipe(
      tap((meetings) => {
        this._meetings.next(meetings);
        if(meetings.length == 0){
          
        }
      }),
      

    );
  }
  getCalls(opportunityId: number): Observable<Call[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Opportunity,
      contactId:opportunityId
    }
    return this._httpClient.post<Call[]>(this.getCallsUrl, data).pipe(
      tap((calls) => {
        this._calls.next(calls);
      }),
      

    );
  }
  getEmails(opportunityId: number): Observable<Email[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Opportunity,
      contactId:opportunityId
    }
    return this._httpClient.post<Email[]>(this.getEmailsUrl, data).pipe(
      tap((emails) => {
        this._emails.next(emails);
      }),
      
    );
  }
  getCustomList(): Observable<OpportunityCustomList[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      type: "Opportunity"
    };
    return this._httpClient.post<OpportunityCustomList[]>(this.getCustomListUrl, data).pipe(
      map(data => {
        return data.map(d => {
          let filter = new OpportunityFilter();
          if (d.filter) {
            const jsonObject = JSON.parse(d.filter);
            filter = {
              opportunityOwner: jsonObject.opportunityOwner && jsonObject.opportunityOwner.length ? jsonObject.opportunityOwner : [],
              createdDate: jsonObject?.createdDate,
              modifiedDate: jsonObject?.modifiedDate,
              opportunityStatus: jsonObject.opportunityStatus && jsonObject.opportunityStatus.length ? jsonObject.opportunityStatus : [],
            };
          }
          return {
            ...d,
            filterParsed: filter
          } as OpportunityCustomList;
        });
      }),
      tap((customList) => {
        this._customLists.next(customList);
      }),
      
    );
  }
  getTags(): Observable<Tag[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Tag[]>(this.getTagsUrl, data).pipe(
      tap((tags) => {
        this._tags.next(tags);
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
  getProduct(): Observable<Product[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Product[]>(this.getProductUrl, data).pipe(
      tap((product) => {
        this._product.next(product);
      }),
      

    );
  }
  getActivities(count: number, opportunityId: number): Observable<any> {
    let data = {
      tenantId: this.user.tenantId,
      id: "-1",//this.user.id,
      count,
      contactTypeId:this.contactEnumInstance.Opportunity,
      contactId:opportunityId
    }
    return this._httpClient.post<Activity[]>(this.getUserActivityListURL, data).pipe(
      tap((response: Activity[]) => {
        this._activities.next(response);
      })
    );
  }
  selectedOpportunity(selectedOpportunity: Opportunity) {
    this._opportunity.next(selectedOpportunity);
  }
  updateTaskStatus(taskId: number, taskTitle, status, opportunityId): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      taskId,
      taskTitle,
      status
    }
    return this._httpClient.post<any>(this.updateTaskStatusUrl, data).pipe(
      tap((customList) => {
        this.getTasks(opportunityId).subscribe();
      }),
      
    );
  }
  updateSearchQuery(value: any) {
    this._searchQuery.next(value);
  }
  updateTaskPriority(taskId: number, taskTitle, priority, opportunityId){
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      taskId,
      taskTitle,
      priority
    }
    return this._httpClient.post<any>(this.updateTaskPriorityUrl, data).pipe(
      tap((customList) => {
        this.getTasks(opportunityId).subscribe();
      }),
      
    );
  }
  saveTask(taskForm, opportunityId: number): Observable<TaskModel> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      type: 'task',
      contactTypeId:this.contactEnumInstance.Opportunity,
      contactId:opportunityId,
      task: {
        ...taskForm.value,

        priorityId: -1,
        statusId: -1,
        tags: taskForm.value.tags.join(',')
      }
    }
    return this._httpClient.post<TaskModel>(this.saveTaskUrl, data).pipe(
      tap((customList) => {
        this.getTasks(opportunityId).subscribe();
      }),
      
    );
  }
  saveNote(note: Note, opportunityId: number): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Opportunity,
      contactId:opportunityId,
      note: {
        noteId: note.noteId,
        noteTitle: note.noteTitle,
        content: note.content,
        tags: note.tags ? note.tags.map(tag => tag.tagId).join(',') : '',
        tasks:note.tasks
      }
    };
    
    return this._httpClient.post<Note[]>(this.saveNotesUrl, data).pipe(
      tap(() => {
        this.getNotes(opportunityId).subscribe();
      }),
      
    );
  }
  saveEmail(email: any, opportunityId: number): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Opportunity,
      contactId:opportunityId,
      emailId: email.emailId,
      subject: email.subject,
      description: email.description
    }
    return this._httpClient.post<Email[]>(this.saveEmailsUrl, data).pipe(
      tap((email) => {
        this.getEmails(opportunityId).subscribe();
      }),
      
    );
  }
  saveMeeting(meeting: any, opportunityId: number): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Opportunity,
      contactId:opportunityId,
      meetingId: meeting.meetingId,
      subject: meeting.subject,
      note: meeting.note,
      startTime: meeting.startTime,
      endTime: meeting.endTime
    }
    return this._httpClient.post<Meeting[]>(this.saveMeetingsUrl, data).pipe(
      tap((meeting) => {
        this.getMeetings(opportunityId).subscribe();
      }),
      
    );
  }
  saveCall(call: any, opportunityId: number): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      companyId: -1,
      leadId: -1,
      opportunityId: opportunityId,
      callId: call.callId,
      subject: call.subject,
      response: call.response,
      startTime: call.startTime,
      endTime: call.endTime,
      contactTypeId:this.contactEnumInstance.Opportunity,
      contactId:opportunityId,
    }
    return this._httpClient.post<Call[]>(this.saveCallsUrl, data).pipe(
      tap((call) => {
        this.getCalls(opportunityId).subscribe();
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
    return this._httpClient.post<Opportunity[]>(this.saveCustomListFilterUrl, data).pipe(
      
    );
  }
  saveCustomList(opportunityList: OpportunityCustomList): Observable<OpportunityCustomList> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      listId: opportunityList.listId,
      listTitle: opportunityList.listTitle,
      isPublic: opportunityList.isPublic,
      type: "Opportunity"
    }
    return this._httpClient.post<OpportunityCustomList>(this.saveCustomListUrl, data).pipe(
      map(customList => {
        let filter = new OpportunityFilter();
        if (customList.filter) {
          const jsonObject = JSON.parse(customList.filter);
          filter = {
            opportunityOwner: jsonObject.opportunityOwner && jsonObject.opportunityOwner.length ? jsonObject.opportunityOwner.split(', ') : [],
            createdDate: jsonObject?.createdDate,
            modifiedDate: jsonObject?.modifiedDate,
            opportunityStatus: jsonObject.opportunityStatus && jsonObject.opportunityStatus.length ? jsonObject.opportunityStatus.split(', ').map(Number) : [],
          };
        }
        return {
          ...customList,
          filterParsed: new OpportunityFilter()
        }
      }),
      tap((customList) => {
        this.setCustomList(customList)
        this.getCustomList().subscribe();
      }),
      
    );
  }
  setCustomList(list: OpportunityCustomList) {
    this._customList.next(list)
  }
  setFilter(filter: OpportunityFilter) {
    this._filter.next(filter);
  }
  saveOpportunity(dto: Opportunity) {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      dto
    }
    
    return this._httpClient.post<Opportunity[]>(this.saveOpportunityURL, data).pipe(
      tap((opportunity) => {
        this.getOpportunity().subscribe()
      }),
      
    )
  }
  deleteOpportunity(opp: Opportunity) {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      opportunityId: opp.opportunityId
    }
    return this._httpClient.post<Opportunity[]>(this.deleteOpportunityURL, data).pipe(
      tap((opportunity) => {
        this.getOpportunity().subscribe()
      }),
      
    )
  }
  deleteNote(noteId: number, opportunityId: number): Observable<Note> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      noteId: noteId
    }
    return this._httpClient.post<Note>(this.deleteNotesURL, data).pipe(
      tap((note) => {
        this.getNotes(opportunityId).subscribe();
      }),
      
    );
  }
  deleteEmail(emailId: number, opportunityId: number): Observable<Email> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      emailId: emailId,

    }
    return this._httpClient.post<Email>(this.deleteEmailsUrl, data).pipe(
      tap((customList) => {
        this.getEmails(opportunityId).subscribe();
      }),
      
    );
  }
  deleteCall(callId: number, opportunityId: number): Observable<Call> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      callId: callId,

    }
    return this._httpClient.post<Call>(this.deleteCallsUrl, data).pipe(
      tap((customList) => {
        this.getCalls(opportunityId).subscribe();
      }),
      
    );
  }
  deleteMeeting(meetingId: number, opportunityId: number): Observable<Meeting> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      meetingId: meetingId,

    }
    return this._httpClient.post<Meeting>(this.deleteMeetingsUrl, data).pipe(
      tap((customList) => {
        this.getMeetings(opportunityId).subscribe();
      }),
      
    );
  }
  deleteTask(taskId: number, taskTitle: string, opportunityId: number): Observable<TaskModel> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      taskId: taskId,
      taskTitle: taskTitle
    }
    return this._httpClient.post<TaskModel>(this.deleteTaskUrl, data).pipe(
      tap((customList) => {
        this.getTasks(opportunityId).subscribe();
      }),
      
    );
  }
  deleteCustomList(opportunityList: OpportunityCustomList): Observable<OpportunityCustomList> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      listId: opportunityList.listId,
      listTitle: opportunityList.listTitle,
    }
    return this._httpClient.post<OpportunityCustomList>(this.deleteCustomListUrl, data).pipe(
      tap((customList) => {
        let list = new OpportunityCustomList({});
        list.listTitle = "All Opportunitys";
        this.setCustomList(list);
        this.getCustomList().subscribe();
      }),
      
    );
  }
}
