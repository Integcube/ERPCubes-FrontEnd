import { Component, OnDestroy, OnInit,Inject, ChangeDetectionStrategy } from '@angular/core';
import { Call, Lead } from '../../../lead.type';
import { EMPTY, Subject, catchError, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeadService } from '../../../lead.service';

@Component({
  selector: 'app-call-detail',
  templateUrl: './call-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallDetailComponent implements OnInit , OnDestroy {
  lead: Lead
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  composeForm: UntypedFormGroup;
  copyFields: { cc: boolean; bcc: boolean } = {
      cc: false,
      bcc: false
  };
  quillModules: any = {
      toolbar: [
          ['bold', 'italic', 'underline'],
          [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
          ['clean']
      ]
  };

  constructor(
      public matDialogRef: MatDialogRef<CallDetailComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: { call: Call },
      private _formBuilder: UntypedFormBuilder,
      private _leadService: LeadService,
  ) {
  }
  ngOnDestroy(): void {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }
  ngOnInit(): void {
      this._leadService.lead$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data =>{ this.lead = { ...data }; this.createForm()})

  }
  createForm() {
      this.composeForm = this._formBuilder.group({
          callId:[this._data.call.callId, Validators.required],
          // to: [this.lead.firstName, [Validators.required, Validators.email]],
          // cc     : ['', [Validators.email]],
          // bcc    : ['', [Validators.email]],
          subject: [this._data.call.subject],
          response: [this._data.call.response, [Validators.required]],
          startTime: [this.formatTime(this._data.call.startTime)],
          endTime: [this.formatTime(this._data.call.endTime)],
      });
  }
  // showCopyField(name: string): void
  // {
  //     if ( name !== 'cc' && name !== 'bcc' )
  //     {
  //         return;
  //     }

  //     this.copyFields[name] = true;
  // }
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

  saveAndClose(): void {
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

    this._leadService
      .saveCall(this.composeForm.value, this.lead.leadId)
      .pipe(
        takeUntil(this._unsubscribeAll),
        catchError((err) => {
          alert(err);
          return EMPTY;
        })
      )
      .subscribe((data) => this.matDialogRef.close());
  }
  discard(): void {
      this.matDialogRef.close();
  }
  saveAsDraft(): void {

  }
  send(): void {

  }
  delete(){
    this._leadService.deleteCall(this.composeForm.value.callId, this.lead.leadId)
    .pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.close())
  }
  close(): void {
    this.matDialogRef.close();
  }
}
