import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, Subject, takeUntil } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { Company, Meeting } from '../../../company.type';
import { CompanyService } from '../../../company.service';



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
  company: Company

  constructor(
    public matDialogRef: MatDialogRef<MeetingDetailComponent>,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { meeting: Meeting },
    private _companyService: CompanyService,
    private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<MeetingDetailComponent>
  ) { }
  ngOnInit(): void {
    this._companyService.company$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data =>{ this.company = { ...data }; })
    this.createForm();
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
    });
}
formatTime(time: Date | string): string {
  if (time instanceof Date) {
    const offsetMinutes = time.getTimezoneOffset();
    const localTime = new Date(time.getTime() - offsetMinutes * 60000); // Adjust for time zone offset

    const hours = ('0' + localTime.getHours()).slice(-2);
    const minutes = ('0' + localTime.getMinutes()).slice(-2);

    return `${hours}:${minutes}`;
  } else {
    return time; // If it's not a Date, assume it's already in the correct format (string)
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
    
    this._companyService.saveMeeting(this.composeForm.value, this.company.companyId)
    .pipe(takeUntil(this._unsubscribeAll)  )
    .subscribe(data=>this.matDialogRef.close())
  }
  close(){
    this.matDialogRef.close();
  }
  delete(){
    this._companyService.deleteMeeting(this.composeForm.value.meetingId, this.company.companyId)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data => this.close())
  }
}

