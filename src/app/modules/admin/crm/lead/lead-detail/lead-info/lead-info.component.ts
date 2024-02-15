import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil, catchError, EMPTY } from 'rxjs';
import { LeadService } from '../../lead.service';
import { Attachment, Call, Email, Lead, Meeting, Note, TaskModel } from '../../lead.type';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { NoteDetailComponent } from '../notes/note-detail/note-detail.component';
import { TaskDetailComponent } from '../tasks/task-detail/task-detail.component';
import { EmailDetailComponent } from '../email/email-detail/email-detail.component';
import { CallDetailComponent } from '../call/call-detail/call-detail.component';
import { MeetingDetailComponent } from '../meeting/meeting-detail/meeting-detail.component';
import{LeadDetailComponent} from 'app/modules/admin/crm/lead/lead-detail/lead-detail.component'
import { LeadScoreComponent } from '../lead-score/lead-score.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
@Component({
  selector: 'app-lead-info',
  templateUrl: './lead-info.component.html',
  styleUrls: ['./lead-info.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class LeadInfoComponent implements OnInit, OnDestroy {
  constructor(private _formBuilder: FormBuilder,
    private _leadService: LeadService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog,
    private _fuseConfirmationService: FuseConfirmationService,
    private _fuseComponentsComponent: LeadDetailComponent)
  { }
  selectedLead: Lead;
  leadForm: FormGroup;
  users$ = this._leadService.users$;
  industries$ = this._leadService.industries$;
  leadStatus$ = this._leadService.leadStatus$;
  leadSource$ = this._leadService.leadSource$;
  products$ = this._leadService.products$;
  calculatedleadScore$ = this._leadService.calculateleadScore$;
  leadAttachments: Attachment[]
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  
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
    this._leadService.leadAttachments$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((attachments: Attachment[]) => {
      this.leadAttachments = { ...attachments };
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
  convertToInteger(value: number): number {
    return parseInt(value.toString(), 10);
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
  leadScore(){
  
    this._matDialog.open(LeadScoreComponent, {
      autoFocus: false,
  });
  }
  getAttachments() {
    this._leadService.getLeadAttachments(this.selectedLead)
      .subscribe(
        (attachments: Attachment[]) => {
          this.leadAttachments = attachments;
        }
      );
  }
  // deleteLeadAttachment(id: number) {
  //   this._leadService.deleteLeadAttachment(id, this.selectedLead)
  //     .subscribe(
  //       (attachments: Attachment[]) => {
  //         this.leadAttachments = { ...attachments };
  //         debugger;
  //       }
  //     );
  // }
  deleteLeadAttachment(id: number) {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete lead',
      message: 'Are you sure you want to delete this lead? This action cannot be undone!',
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
        this._leadService.deleteLeadAttachment(id, this.selectedLead)
        .subscribe(
          (attachments: Attachment[]) => {
            this.leadAttachments = { ...attachments };
            debugger;
          }
        );
      }
    });
  }
  downloadFile(file: Attachment){
    debugger;
    this._leadService.downloadFile(file.path).pipe(takeUntil(this._unsubscribeAll))
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
  file:any;
  invalidFileMessage: string | null = null;
  isFileValid = false;
  fileUploaded = false;
  isFileUploading = false;
  selectFile(event) {
    this.file = event.target.files[0];
  
    if (!this.file) {
      console.error('No file selected');
      this.isFileValid = false;
      return;
    }
  
    const allowedFileExtensions = ['.xlsx', '.xls'];
    const fileExtension = this.file.name.toLowerCase();
  
    if (!allowedFileExtensions.some(ext => fileExtension.endsWith(ext))) {
      // Set the error message for invalid file type
      this.invalidFileMessage = 'Invalid file type. Please upload a valid Excel file.';
      this.isFileValid = false;
    } else {
      this.invalidFileMessage = null; // Clear the error message
      this.isFileValid = true; // File is valid
    }
  
    this.fileUploaded = false;
  }
}
