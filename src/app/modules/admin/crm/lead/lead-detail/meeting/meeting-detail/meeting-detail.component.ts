import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, Subject, takeUntil } from 'rxjs';
import { LeadService } from '../../../lead.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { Lead, Meeting } from '../../../lead.type';



@Component({
  selector: 'app-detail-detail',
  templateUrl: './meeting-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingDetailComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public matDialogRef: MatDialogRef<MeetingDetailComponent>,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { meeting: Meeting },
    private _leadService: LeadService,
    private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<MeetingDetailComponent>) 
  { }

  composeForm: UntypedFormGroup;
  lead: Lead

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
        startTime: [this.formatTime(this._data.meeting.startTime)],
        endTime: [this.formatTime(this._data.meeting.endTime)],
        meetingDate:[this._data.meeting.meetingDate],
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
 
  formatTime(time: string|Date): string {
    const date = new Date(time);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  }

  save(){

    const startTimeValue = this.composeForm.get('startTime').value;
    const endTimeValue = this.composeForm.get('endTime').value;

    // Assuming that the date is the same for both start and end time, you may need to adjust this based on your requirements
    const currentDate = new Date().toISOString().split('T')[0];

    const formattedStartTime = `${currentDate}T${startTimeValue}`;
    const formattedEndTime = `${currentDate}T${endTimeValue}`;

    this.composeForm.patchValue({
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });
    
    this._leadService.saveMeeting(this.composeForm.value, this.lead.leadId)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data=>this.matDialogRef.close())
  }

  close(){
    this.matDialogRef.close();
  }

  delete(){
    this._leadService.deleteMeeting(this.composeForm.value.meetingId, this.lead.leadId)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data => this.close())
  }

  resetmeetingDate(): void {
    this.composeForm.get('meetingDate').setValue(null);
    this._changeDetectorRef.markForCheck()
  }

}

