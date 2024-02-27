import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil, catchError, EMPTY } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { NoteDetailComponent } from '../notes/note-detail/note-detail.component';
import { TaskDetailComponent } from '../tasks/task-detail/task-detail.component';
import { EmailDetailComponent } from '../email/email-detail/email-detail.component';
import { CallDetailComponent } from '../call/call-detail/call-detail.component';
import { MeetingDetailComponent } from '../meeting/meeting-detail/meeting-detail.component';
import { Attachment, Call, Email, Meeting, Note, Opportunity, TaskModel } from '../../opportunity.types';
import { OpportunityService } from '../../opportunity.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-opportunity-info',
  templateUrl: './opportunity-info.component.html',
  styleUrls: ['./opportunity-info.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class OpportunityInfoComponent implements OnInit, OnDestroy {
  user: User
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('triggerFileInput') triggerFileInput: ElementRef;
  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _opportunityService: OpportunityService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _matDialog: MatDialog )
  { 
    this._userService.user$.subscribe(user => { this.user = user});
  }
  selectedOpportunity: Opportunity;
  opportunityForm: FormGroup;
  users$ = this._opportunityService.users$;
  industries$ = this._opportunityService.industries$;
  opportunityStatus$ = this._opportunityService.opportunityStatus$;
  opportunitySource$ = this._opportunityService.opportunitySource$;
  product$ = this._opportunityService.product$;
  
  opportunityAttachments$ = this._opportunityService.opportunityAttachments$

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
    .subscribe((opportunity: Opportunity) => {
      this.selectedOpportunity = { ...opportunity };
      this.opportunityForm.patchValue(opportunity, { emitEvent: false });
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
  getAttachments() {
    this._opportunityService.getOpportunityAttachments(this.selectedOpportunity)
      .subscribe(
        // (attachments: Attachment[]) => {
        //   this.leadAttachments = attachments;
        // }
      );
  }
  deleteOpportunityAttachment(id: number) {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Attachment',
      message: 'Are you sure you want to delete this attachment? This action cannot be undone!',
      actions: {
        confirm: {
          label: 'Delete'
        }
      }
    });
    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        this._opportunityService.deleteOpportunityAttachment(id, this.selectedOpportunity)
        .subscribe(
          () => {
            this.getAttachments();
            this._changeDetectorRef.detectChanges();
          }
        );
      }
    });
  }
  downloadFile(file: Attachment){
    this._opportunityService.downloadFile(file.path).pipe(takeUntil(this._unsubscribeAll))
    .subscribe(
        data=>{
            if(data.body.size < 100){
              }
              else{
                const fileExtension = file.type;
                const url = window.URL.createObjectURL(data.body);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${file.fileName}.${fileExtension}`;
                a.click();
                window.URL.revokeObjectURL(url);
              }
        }
    );
  }
  selectFile(event) {
    event.stopPropagation();
    const file = event.target.files[0];
    
    if (!file) {
      console.error('No file selected');
      return;
    }
    this._opportunityService.saveFile(file, this.selectedOpportunity)
      .subscribe(() => {
        this.getAttachments();
        this._changeDetectorRef.detectChanges();
      }
    );
    
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
