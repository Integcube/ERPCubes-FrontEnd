import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil, catchError, EMPTY } from 'rxjs';
import { LeadService } from '../../lead.service';
import { Call, Email, Lead, Meeting, Note, TaskModel } from '../../lead.type';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { NoteDetailComponent } from '../notes/note-detail/note-detail.component';
import { TaskDetailComponent } from '../tasks/task-detail/task-detail.component';
import { EmailDetailComponent } from '../email/email-detail/email-detail.component';
import { CallDetailComponent } from '../call/call-detail/call-detail.component';
import { MeetingDetailComponent } from '../meeting/meeting-detail/meeting-detail.component';
import{LeadDetailComponent} from 'app/modules/admin/crm/lead/lead-detail/lead-detail.component'
@Component({
  selector: 'app-lead-info',
  templateUrl: './lead-info.component.html',
  styleUrls: ['./lead-info.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class LeadInfoComponent implements OnInit, OnDestroy {

  selectedLead: Lead;
  leadForm: FormGroup;
  users$ = this._leadService.users$;
  industries$ = this._leadService.industries$;
  leadStatus$ = this._leadService.leadStatus$;
  leadSource$ = this._leadService.leadSource$;
  product$ = this._leadService.product$;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _formBuilder: FormBuilder,
    private _leadService: LeadService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog,
    private _fuseComponentsComponent: LeadDetailComponent


    ) {
  }
  save() {
    this.selectedLead = { ...this.leadForm.value }
    this._leadService.saveLead(this.selectedLead).subscribe(
      {
        next: () => {
          this._changeDetectorRef.markForCheck();

        },
        
      }
    );
  }
  ngOnInit(): void {
    this.leadForm = this._formBuilder.group({
      leadId: [, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [''],
      leadOwner: ['', Validators.required],
      status: [''],
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
    this._leadService.lead$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((company: Lead) => {
      this.selectedLead = { ...company };
      this.leadForm.patchValue(company, { emitEvent: false });
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
 toggleDrawer(): void
  {
      // Toggle the drawer
      this._fuseComponentsComponent.matDrawer.toggle();
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
