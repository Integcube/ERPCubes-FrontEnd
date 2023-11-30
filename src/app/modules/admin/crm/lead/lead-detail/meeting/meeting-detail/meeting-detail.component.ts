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
  meeting$ = this._leadService.meeting$;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { meeting: Meeting },
    private _leadService: LeadService,
    private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<MeetingDetailComponent>
  ) { }
  ngOnInit(): void {
    this.meetingForm = this._formBuilder.group({
      meetingId: ['', Validators.required],
      subject: ['', Validators.required],
      note: [''],
      startTime: [null],
      endTime: [null],
      createdBy:[''], 
      createdDate: [null],
    });
    if (this._data.meeting.meetingId) {
      this._leadService.getMeetingById(this._data.meeting.meetingId).pipe(
        takeUntil(this._unsubscribeAll),
      ).subscribe(
        (data) => {
          this.meetingForm.patchValue(data, { emitEvent: false });
          this._changeDetectorRef.markForCheck();
        },
        error => {
          console.error("Error fetching data: ", error);
        }
      );
    }
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

