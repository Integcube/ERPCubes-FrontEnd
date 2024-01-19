import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, debounceTime, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { Activity, Call, Company, CompanyCustomList, CompanyFilter, Email, Industry, Meeting, Note, Tag, TaskModel, Tasks } from './company.type';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { ContactEnum } from 'app/core/enum/crmEnum';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private readonly getcompanyListURL = `${environment.url}/Company/all`
  private readonly saveCompanyURL = `${environment.url}/Company/save`
  private readonly deleteCompanyURL = `${environment.url}/Company/delete`
  private readonly getIndustriesURL = `${environment.url}/Industry/all`
  private readonly getUsersUrl = `${environment.url}/Users/all`
  private readonly getCustomListUrl = `${environment.url}/CustomList/all`
  private readonly saveCustomListUrl = `${environment.url}/CustomList/save`
  private readonly deleteCustomListUrl = `${environment.url}/CustomList/delete`
  private readonly saveCustomListFilterUrl = `${environment.url}/CustomList/saveFilter`
  private readonly getUserActivityListURL = `${environment.url}/UserActivity/Get`
  private readonly getNotesUrl = `${environment.url}/Notes/all`
  private readonly getTaskUrl = `${environment.url}/Notes/tasks`
  private readonly saveNotesUrl = `${environment.url}/Notes/save`
  private readonly deleteNotesURL = `${environment.url}/Notes/delete`
  private readonly getTagsUrl = `${environment.url}/Notes/tags`
  private readonly getTaskTagsUrl = `${environment.url}/Task/tags`
  private readonly getEmailsUrl = `${environment.url}/Email/all`
  private readonly saveEmailsUrl = `${environment.url}/Email/save`
  private readonly getCallsUrl = `${environment.url}/Call/all`
  private readonly saveCallsUrl = `${environment.url}/Call/save`
  private readonly getMeetingsUrl = `${environment.url}/Meeting/all`
  private readonly saveMeetingsUrl = `${environment.url}/Meeting/save`
  private readonly getCompanyTaskUrl = `${environment.url}/Task/all`
  private readonly updateTaskStatusUrl = `${environment.url}/Task/updateStatus`
  private readonly saveTaskUrl = `${environment.url}/Task/save`
  private readonly deleteTaskUrl = `${environment.url}/Task/delete`
  private readonly updateTaskPriorityUrl = `${environment.url}/Task/updatePriority`
  private readonly deleteEmailsUrl = `${environment.url}/Email/delete`
  private readonly allTagsUrl = `${environment.url}/Tags/all`
  private readonly deleteCallsUrl = `${environment.url}/Call/delete`
  private readonly deleteMeetingsUrl = `${environment.url}/Meeting/delete`
  private contactEnumInstance: ContactEnum;

  
  user: User;

  private _industries: BehaviorSubject<Industry[] | null> = new BehaviorSubject(null);
  private _company: BehaviorSubject<Company | null> = new BehaviorSubject(null);
  private _companies: BehaviorSubject<Company[] | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
  private _customLists: BehaviorSubject<CompanyCustomList[] | null> = new BehaviorSubject(null);
  private _customList: BehaviorSubject<CompanyCustomList | null> = new BehaviorSubject(null);
  private _filter: BehaviorSubject<CompanyFilter | null> = new BehaviorSubject(null);

  private _serachQuery: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _activities: BehaviorSubject<Activity[] | null> = new BehaviorSubject(null);

  private _notes: BehaviorSubject<Note[] | null> = new BehaviorSubject(null);
  private _note: BehaviorSubject<Note | null> = new BehaviorSubject(null);
  private _task: BehaviorSubject<TaskModel | null> = new BehaviorSubject(null);
  private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
  private _emails:BehaviorSubject<Email[] | null> = new BehaviorSubject(null);
  private _calls:BehaviorSubject<Call[] | null> = new BehaviorSubject(null);
  private _meetings:BehaviorSubject<Meeting[] | null> = new BehaviorSubject(null);
  private _meeting:BehaviorSubject<Meeting | null> = new BehaviorSubject(null);
  private _tasks: BehaviorSubject<TaskModel[] | null> = new BehaviorSubject(null);

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
  ) 
  {
    this._userService.user$.subscribe(user => {
      this.user = user;
    })
    this.contactEnumInstance = new ContactEnum();
  }
  get filter$(): Observable<CompanyFilter> {
    return this._filter.asObservable();
  }
  get industries$():Observable<Industry[]>{
    return this._industries.asObservable();
  }
  get customLists$(): Observable<CompanyCustomList[]> {
    return this._customLists.asObservable();
  }
  get customList$(): Observable<CompanyCustomList> {
    return this._customList.asObservable();
  }
  get users$(): Observable<User[]> {
    return this._users.asObservable();
  }
  get company$(): Observable<Company> {
    return this._company.asObservable();
  }
  get companies$(): Observable<Company[]> {
    return this._companies.asObservable();
  }

  get activities$(): Observable<any> {
    return this._activities.asObservable();
  }
  
  get notes$(): Observable<Note[]> {
    return this._notes.asObservable();
  }
  get note$(): Observable<Note> {
    return this._note.asObservable();
  }
  get searchQuery$(): Observable<any> {
    return this._serachQuery.asObservable();
  }
  get task$(): Observable<TaskModel> {
    return this._task.asObservable();
  }
  get tags$(): Observable<Tag[]> {
    return this._tags.asObservable();
  }
  get emails$(): Observable<Email[]> {
    return this._emails.asObservable();
  }
  get calls$(): Observable<Call[]> {
    return this._calls.asObservable();
  }
  get meetings$(): Observable<Meeting[]> {
    return this._meetings.asObservable();
  }
  get meeting$(): Observable<Meeting> {
    return this._meeting.asObservable();
  }
  get tasks$(): Observable<TaskModel[]> {
    return this._tasks.asObservable();
  }
  
  filteredCompanies$ = combineLatest(
    this.companies$,
    this.filter$
  ).pipe(
    map(([companies, filter]) => {
      return companies.filter(company => {
        let passFilter = true;
        if (filter.companyOwner.length > 0) {
          passFilter = passFilter && filter.companyOwner.includes(company.companyOwner);
        }
        if (filter.industryId.length > 0) {
          passFilter = passFilter && filter.industryId.includes(company.industryId);
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
  getIndustries(): Observable<Industry[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Industry[]>(this.getIndustriesURL, data).pipe(
      tap((industries) => {
        this._industries.next(industries);
      })
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
      })
    );
  }
  getCustomList(): Observable<CompanyCustomList[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      type: "Company"
    }
    return this._httpClient.post<CompanyCustomList[]>(this.getCustomListUrl, data).pipe(
      map(data => {
        return data.map(d => {
          let filter = new CompanyFilter();
          if(d.filter){
            const jsonObject = JSON.parse(d.filter);
            ;
            filter = {
              companyOwner: jsonObject.companyOwner && jsonObject.companyOwner.length ? jsonObject.companyOwner : [],
              createdDate: jsonObject?.createdDate,
              modifiedDate: jsonObject?.modifiedDate,
              industryId: jsonObject.industryId && jsonObject.industryId.length ? jsonObject.industryId : [],
            };
          }
          return {
            ...d,
            filterParsed: filter
          } as CompanyCustomList;
        });
      }),
      tap((customList) => {
        this._customLists.next(customList);
      }),
      catchError(error => { alert(error); return EMPTY; })
    );
  }
  deleteCustomList(companyList: CompanyCustomList): Observable<CompanyCustomList> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      listId: companyList.listId,
      listTitle: companyList.listTitle,
    }
    return this._httpClient.post<CompanyCustomList>(this.deleteCustomListUrl, data).pipe(
      tap((customList) => {
        let list = new CompanyCustomList({});
        list.listTitle = "All Leads";
        this.setCustomList(list);
        this.getCustomList().subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  setCustomList(list: CompanyCustomList){
    this._customList.next(list);
  }
  saveCustomList(companyList: CompanyCustomList): Observable<CompanyCustomList> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      listId: companyList.listId,
      listTitle: companyList.listTitle,
      filter: companyList.filter,
      isPublic: companyList.isPublic,
      type: "Company"
    }
    ;
    return this._httpClient.post<CompanyCustomList>(this.saveCustomListUrl, data).pipe(
      map(customList => {
        let filter = new CompanyFilter();
        if (customList.filter) {
          const jsonObject = JSON.parse(customList.filter);
          filter = {
            companyOwner: jsonObject.companyOwner && jsonObject.companyOwner.length ? jsonObject.companyOwner.split(',') : [],
            createdDate: jsonObject?.createdDate,
            modifiedDate: jsonObject?.modifiedDate,
            industryId: jsonObject.industryId && jsonObject.industryId.length ? jsonObject.industryId.split(', ').map(Number) : [],
          };
        }
        return {
          ...customList,
          filterParsed: new CompanyFilter()
        }
      }),
      tap((customList) => {
        this.setCustomList(customList)
        this.getCustomList().subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  setFilter(filter: CompanyFilter){
    this._filter.next(filter);
  }
  saveCustomFilter(listId: number, listTitle: string, filter: string): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      listId,
      listTitle,
      filter
    }
    return this._httpClient.post<any>(this.saveCustomListFilterUrl, data).pipe(
      catchError(error => { alert(error); return EMPTY })
    );
  }
  getCompanies(): Observable<Company[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Company[]>(this.getcompanyListURL, data).pipe(
      tap((companies) => {
        this._companies.next(companies);
      
      })
    );
  }
  saveCompany(company:Company){
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      company
    }
    return this._httpClient.post<Company[]>(this.saveCompanyURL, data).pipe(
      tap((companies) => {
        this.getCompanies().subscribe();
      })
    );
  }
  deleteCompany(company:Company){
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      companyId:company.companyId,
      name:company.name,
    }
    return this._httpClient.post<Company[]>(this.deleteCompanyURL, data).pipe(
      tap((company) => {
        this.getCompanies().subscribe();
      })
    );
  }
  selectedCompany(selectedCompany: Company) {
    this._company.next(selectedCompany);
  }
  getCompanyById(id: number): Observable<Company> {
    return this._companies.pipe(
      take(1),
      map((companies) => {
        if (id === -1) {
          const company = new Company({});
          this._company.next(company);
          return company;
        }
        else {
          const company = companies.find(item => item.companyId === id) || null;
          this._company.next(company);
          return company;
        }
      }),
      switchMap((company) => {
        if (!company) {
          return throwError('Could not found task with id of ' + id + '!');
        }
        return of(company);
      })
    );
  }
  getActivities(count: number, companyId: number): Observable<any> {
    let data = {
      tenantId: this.user.tenantId,
      id: "-1",//this.user.id,
      count,
      contactTypeId:this.contactEnumInstance.Company,
      contactId:companyId,
    }
    return this._httpClient.post<Activity[]>(this.getUserActivityListURL, data).pipe(
      tap((response: Activity[]) => {
        this._activities.next(response);
      })
    );
  }
  updateSearchQuery(value: any) {
    this._serachQuery.next(value);
  }
  getNotes(companyId: number): Observable<Note[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Company,
      contactId:companyId,
    }
    return this._httpClient.post<Note[]>(this.getNotesUrl, data).pipe(
      tap((notes) => {
        this._notes.next(notes);
      }),
      catchError(error => { alert(error); return EMPTY })

    );
  }
  getCalls(companyId: number): Observable<Call[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Company,
      contactId:companyId
    }
    return this._httpClient.post<Call[]>(this.getCallsUrl, data).pipe(
      tap((calls) => {
        this._calls.next(calls);
      }),
      catchError(error => { alert(error); return EMPTY })

    );
  }
  getTasks(companyId: number): Observable<TaskModel[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Company,
      contactId:companyId,
    }
    return this._httpClient.post<TaskModel[]>(this.getCompanyTaskUrl, data).pipe(
      tap((tasks) => {
        this._tasks.next(tasks);
      }),
      catchError(error => { alert(error); return EMPTY })

    );
  }
  getEmails(companyId: number): Observable<Email[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Company,
      contactId:companyId
    }
    return this._httpClient.post<Email[]>(this.getEmailsUrl, data).pipe(
      tap((emails) => {
        this._emails.next(emails);
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  getMeetings(companyId: number): Observable<Meeting[]> {
    let data = {
      id: "-1",
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Company,
      contactId:companyId
    }
    return this._httpClient.post<Meeting[]>(this.getMeetingsUrl, data).pipe(
      tap((meetings) => {
        this._meetings.next(meetings);
      }),
      catchError(error => { alert(error); return EMPTY })

    );
  }
  saveCall(call: any, companyId: number): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      callId: call.callId,
      subject: call.subject,
      response: call.response,
      startTime: call.startTime,
      endTime: call.endTime,
      contactTypeId:this.contactEnumInstance.Company,
      contactId:companyId
    }
    return this._httpClient.post<Call[]>(this.saveCallsUrl, data).pipe(
      tap((call) => {
        this.getCalls(companyId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  saveEmail(email: any, companyId: number): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      emailId: email.emailId,
      subject: email.subject,
      description: email.description,
      contactTypeId:this.contactEnumInstance.Company,
      contactId:companyId
    }
    return this._httpClient.post<Email[]>(this.saveEmailsUrl, data).pipe(
      tap((email) => {
        this.getEmails(companyId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  saveMeeting(meeting: any, companyId: number): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Company,
      contactId:companyId,
      meetingId: meeting.meetingId,
      subject: meeting.subject,
      note: meeting.note,
      startTime: meeting.startTime,
      endTime: meeting.endTime
    }
    return this._httpClient.post<Meeting[]>(this.saveMeetingsUrl, data).pipe(
      tap((meeting) => {
        this.getMeetings(companyId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  getMeetingById(id: number): Observable<Meeting> {
    return this._meetings.pipe(
      take(1),
      map((meetings) => {
        if (id == -1) {
          const meeting = new Meeting({});
          this._meeting.next(meeting);
          return meeting
        }
        else {
          const meeting = meetings.find(value => value.meetingId === id) || null;
          this._meeting.next(meeting);
          return meeting;
        }
      }),
      switchMap((meeting) => {
        if (!meeting) {
          return throwError('Could not found the meeting with id of ' + id + '!');
        }
        return of(meeting);
      })
    );
  }
  saveNote(note: Note, companyId: number): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      contactTypeId:this.contactEnumInstance.Company,
      contactId:companyId,
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
        this.getNotes(companyId).subscribe();
      }),
      catchError(error => {
        alert(error);
        return EMPTY;
      })
    );
  }  
  deleteNote(noteId: number, companyId: number): Observable<Note> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      noteId: noteId
    }
    return this._httpClient.post<Note>(this.deleteNotesURL, data).pipe(
      tap((note) => {
        this.getNotes(companyId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
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
  saveTask(taskForm, companyId: number): Observable<TaskModel> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      type: 'task',
      contactTypeId:this.contactEnumInstance.Company,
      contactId:companyId,
      task: {
        ...taskForm.value,

        priorityId: -1,
        statusId: -1,
        tags: taskForm.value.tags.join(',')
      }
    }
    return this._httpClient.post<TaskModel>(this.saveTaskUrl, data).pipe(
      tap((customList) => {
        this.getTasks(companyId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  deleteTask(taskId: number, taskTitle: string, companyId: number): Observable<TaskModel> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      taskId: taskId,
      taskTitle: taskTitle
    }
    return this._httpClient.post<TaskModel>(this.deleteTaskUrl, data).pipe(
      tap((customList) => {
        this.getTasks(companyId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
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
  updateTaskStatus(taskId: number, taskTitle, status, companyId): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      taskId,
      taskTitle,
      status
    }
    return this._httpClient.post<any>(this.updateTaskStatusUrl, data).pipe(
      tap((customList) => {
        this.getTasks(companyId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  updateTaskPriority(taskId: number, taskTitle, priority, companyId){
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      taskId,
      taskTitle,
      priority
    }
    return this._httpClient.post<any>(this.updateTaskPriorityUrl, data).pipe(
      tap((customList) => {
        this.getTasks(companyId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  deleteEmail(emailId: number, companyId: number): Observable<Email> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      emailId: emailId,

    }
    return this._httpClient.post<Email>(this.deleteEmailsUrl, data).pipe(
      tap((customList) => {
        this.getEmails(companyId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
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
      catchError(error => { alert(error); return EMPTY })
    );
  }
  deleteCall(callId: number, companyId: number): Observable<Call> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      callId: callId,
    }
    return this._httpClient.post<Call>(this.deleteCallsUrl, data).pipe(
      tap((customList) => {
        this.getCalls(companyId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  deleteMeeting(meetingId: number, companyId: number): Observable<Meeting> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      meetingId: meetingId,

    }
    return this._httpClient.post<Meeting>(this.deleteMeetingsUrl, data).pipe(
      tap((customList) => {
        this.getMeetings(companyId).subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
}
