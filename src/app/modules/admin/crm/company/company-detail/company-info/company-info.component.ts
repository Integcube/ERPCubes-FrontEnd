import { ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, Subject } from 'rxjs';
import { CompanyService } from '../../company.service';
import { Call, Company, Email, Meeting, Note, TaskModel } from '../../company.type';
import { NoteDetailComponent } from '../notes/note-detail/note-detail.component';
import { cloneDeep } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailComponent } from '../tasks/task-detail/task-detail.component';
import { MeetingDetailComponent } from '../meeting/meeting-detail/meeting-detail.component';
import { CallDetailComponent } from '../call/call-detail/call-detail.component';
import { EmailDetailComponent } from '../email/email-detail/email-detail.component';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyInfoComponent implements OnInit, OnDestroy {
  selectedCompany: Company;
  companyForm: FormGroup;
  users$ = this._companyService.users$;
  industries$ = this._companyService.industries$;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private companySubject = new Subject<Company>();
  company$ = this.companySubject.asObservable();
  constructor(private _formBuilder: FormBuilder,
    private _companyService: CompanyService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog,)
  {  }
  save() {
    this.selectedCompany = { ...this.companyForm.value }
    this._companyService.saveCompany(this.selectedCompany)
    .subscribe({ next: () => { this._changeDetectorRef.markForCheck(); }});
  }
  ngOnInit(): void {
    this.company$ = this._companyService.company$;
    this.companyForm = this._formBuilder.group({
      companyId: [, Validators.required],
      name: ['', Validators.required],
      website: ['', Validators.required],
      companyOwner: [, Validators.required],
      mobile: [''],
      work: [''],
      billingAddress: [''],
      billingStreet: [''],
      billingCity: [''],
      billingZip: [''],
      billingState: [''],
      billingCountry: [''],
      deliveryAddress: [''],
      deliveryStreet: [''],
      deliveryCity: [''],
      deliveryZip: [''],
      deliveryState: [''],
      deliveryCountry: [''],
      industryId: [],
      industryTitle: [''],
      createdDate: ['']
    });
    this._companyService.company$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((company: Company) => {
      this.selectedCompany = { ...company };
      this.companyForm.patchValue(company, { emitEvent: false });
      this._changeDetectorRef.markForCheck();
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  addNote(){
    let note = new Note({})
    this._matDialog.open(NoteDetailComponent, {
      autoFocus: false,
      data     : {
          note: cloneDeep(note)
      }
  });
  }
  addTask(){
    let tasks = new TaskModel({})
    this._matDialog.open(TaskDetailComponent, {
      autoFocus: false,
      data     : {
          task: cloneDeep(tasks)
      }
  });
  }
  addMeeting(){
    let meeting = new Meeting({})
    this._matDialog.open(MeetingDetailComponent, {
      autoFocus: false,
      data     : {
          meeting: cloneDeep(meeting)
      }
  });
  }
  addCall(){
    let call = new Call({})
    this._matDialog.open(CallDetailComponent, {
      autoFocus: false,
      data     : {
          call: cloneDeep(call)
      }
  });
  }
  addEmail(){
    let email = new Email({})
    this._matDialog.open(EmailDetailComponent, {
      autoFocus: false,
      data     : {
          email: cloneDeep(email)
      }
  });
  }
}
