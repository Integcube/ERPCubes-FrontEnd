import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, Subject, catchError, combineLatest, map, takeUntil } from 'rxjs';
import { LeadService } from '../../../lead.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { cloneDeep, filter } from 'lodash';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { Lead, Meeting } from '../../../lead.type';



@Component({
  selector: 'app-detail-detail',
  templateUrl: './meeting-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingDetailComponent implements OnInit, OnDestroy {

  composeForm: UntypedFormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  // meeting: Meeting;
  // meeting$ = this._leadService.meeting$;
  lead: Lead

  constructor(
    public matDialogRef: MatDialogRef<MeetingDetailComponent>,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { meeting: Meeting },
    private _leadService: LeadService,
    private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<MeetingDetailComponent>
  ) { }
  ngOnInit(): void {
    this._leadService.lead$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data =>{ this.lead = { ...data }; this.createForm()})

  }

  createForm() {
    this.composeForm = this._formBuilder.group({
        meetingId:[this._data.meeting.meetingId, Validators.required],
        // to: [this.lead.firstName, [Validators.required, Validators.email]],
        // cc     : ['', [Validators.email]],
        // bcc    : ['', [Validators.email]],
        subject: [this._data.meeting.subject],
        note: [this._data.meeting.note, [Validators.required]],
        startTime: [this._data.meeting.startTime],
        endTime: [this._data.meeting.endTime]
    });
}
  isOverdue(date: string): boolean {
    return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  closeDialog(): void {
    this._matDialogRef.close();
  }
 

    save(){
    this._leadService.saveMeeting(this.composeForm.value, 1).pipe(
      takeUntil(this._unsubscribeAll),
      catchError(err=>{alert(err);
      return EMPTY})).subscribe(data=>this.matDialogRef.close())
  }
}

