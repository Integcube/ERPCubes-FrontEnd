import { Component, OnDestroy, OnInit,Inject, ChangeDetectionStrategy } from '@angular/core';
import { EMPTY, Subject, catchError, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Call, Company } from '../../../company.type';
import { CompanyService } from '../../../company.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-call-detail',
  templateUrl: './call-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallDetailComponent implements OnInit , OnDestroy {
  company: Company
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
      private _companyService: CompanyService,

  ) {
  }
  ngOnDestroy(): void {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }
  ngOnInit(): void {
      this._companyService.company$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data =>{ this.company = { ...data }; this.createForm()})

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

    this._companyService
      .saveCall(this.composeForm.value, this.company.companyId)
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
  close(): void {
    this.matDialogRef.close();
  }
  delete(){
    this._companyService.deleteCall(this.composeForm.value.callId, this.company.companyId)
    .pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.close())
  }
}
