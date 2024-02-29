import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil, catchError, EMPTY } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { NoteDetailComponent } from '../notes/note-detail/note-detail.component';
import { TaskDetailComponent } from '../tasks/task-detail/task-detail.component';
import { EmailDetailComponent } from '../email/email-detail/email-detail.component';
import { CallDetailComponent } from '../call/call-detail/call-detail.component';
import { MeetingDetailComponent } from '../meeting/meeting-detail/meeting-detail.component';
import { Call, Email, Meeting, Note, Opportunity, TaskModel } from '../../opportunity.types';
import { OpportunityService } from '../../opportunity.service';

@Component({
  selector: 'app-opportunity-info',
  templateUrl: './opportunity-info.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class OpportunityInfoComponent implements OnInit, OnDestroy {
  constructor(private _formBuilder: FormBuilder,
    private _opportunityService: OpportunityService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog)
    {}
  selectedOpportunity: Opportunity;
  opportunityForm: FormGroup;
  users$ = this._opportunityService.users$;
  industries$ = this._opportunityService.industries$;
  opportunityStatus$ = this._opportunityService.opportunityStatus$;
  opportunitySource$ = this._opportunityService.opportunitySource$;
  product$ = this._opportunityService.product$;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  save() {
    this.selectedOpportunity = { ...this.opportunityForm.value }
    this._opportunityService.saveOpportunity(this.selectedOpportunity).subscribe(
      {
        next: () => {
          this._changeDetectorRef.markForCheck();

        },
        
      }
    );
  }
  ngOnInit(): void {
    this.opportunityForm = this._formBuilder.group({
      opportunityId: [, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [''],
      opportunityOwner: ['', Validators.required],
      statusId: [''],
      mobile: [''],
      work: [''],
      address: [''],
      street: [''],
      city: [''],
      zip: [''],
      state: [''],
      country: [''],
      sourceId: [''],
      industryId: [''],
      productId: [''],
      createdDate: ['']
    });
    this._opportunityService.opportunity$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((company: Opportunity) => {
      this.selectedOpportunity = { ...company };
      this.opportunityForm.patchValue(company, { emitEvent: false });
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
