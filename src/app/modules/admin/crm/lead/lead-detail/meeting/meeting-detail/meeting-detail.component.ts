import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, combineLatest, map, takeUntil } from 'rxjs';
import { LeadService } from '../../../lead.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { cloneDeep, filter } from 'lodash';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { Meeting } from '../../../lead.type';



@Component({
  selector: 'app-detail-detail',
  templateUrl: './meeting-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingDetailComponent implements OnInit, OnDestroy {

  meetingForm: UntypedFormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  meeting: Meeting;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public _data: { meeting: Meeting },
    private _leadService: LeadService,
    private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<MeetingDetailComponent>
  ) { }
  ngOnInit(): void {
    this.meetingForm = this._formBuilder.group({
      meetingId: [this._data.meeting.meetingId, Validators.required],
      subject: [this._data.meeting.subject, Validators.required],
      note: [this._data.meeting.note],
      startTime: [this._data.meeting.startTime],
      endTime: [this._data.meeting.endTime],
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
    this._leadService.saveMeeting(this.meetingForm, 1).subscribe(data=>{this._changeDetectorRef.markForCheck()});
  }
}

