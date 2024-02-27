import { Component, OnDestroy, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Call, Lead } from '../../../lead.type';
import { EMPTY, Subject, catchError, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeadService } from '../../../lead.service';
import moment from 'moment';

@Component({
  selector: 'app-call-detail',
  templateUrl: './call-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallDetailComponent implements OnInit, OnDestroy {
  lead: Lead
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public matDialogRef: MatDialogRef<CallDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { call: Call },
    private _formBuilder: UntypedFormBuilder,
    private _leadService: LeadService,
    private cdr: ChangeDetectorRef) { }

  composeForm: UntypedFormGroup;
  call: Call
  selectedScenario: any;
  selectedIsTask: any;
  scenarioslist$ = this._leadService.CallReason$
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

  ngOnInit(): void {

    this._leadService.lead$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data => {
      this.lead = { ...data };
      this.createForm();
    })
    this.onScenarioSelectionChange(this._data.call.reasonId);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  createForm() {
    this.composeForm = this._formBuilder.group({
      callId: [this._data.call.callId, Validators.required],

      subject: [this._data.call.subject, [Validators.required]],
      response: [this._data.call.response],
      startTime: [this.formatTime(this._data.call.startTime), [Validators.required]],
      endTime: [this.formatTime(this._data.call.endTime), [Validators.required]],
      reasonId: [this._data.call.reasonId],
      dueDate: [this._data.call.dueDate],
      isTask: [this._data.call.isTask],
      taskId: [this._data.call.taskId],
      tasktime: [this.formatTime(this._data.call.dueDate)],
      callDate: [this._data.call.callDate],

    });

  }
  formatTime(time: string | Date): string {
    const date = new Date(time);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  }

  onScenarioSelectionChange(selectedId: number): void {
    this.scenarioslist$.subscribe(scenarios => {
      const obj = scenarios.find(scenario => scenario.reasonId === selectedId);
      this.selectedScenario = obj && obj.isShowResponse === 1;
      this.selectedIsTask = obj && obj.isTask === 1;
      const isTaskValue = this.selectedIsTask ? 1 : 0;
      this.composeForm.patchValue({ isTask: isTaskValue });
    });
  }

  combineDateAndTime(dueDateString: Date, time: string): Date {
    const date = new Date(dueDateString);
    const timeSplit = time.split(':');
    const hours = parseInt(timeSplit[0], 10);
    const minutes = parseInt(timeSplit[1], 10);
    if (date instanceof Date) {
      const combinedDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes
      );
      return combinedDateTime;
    } else {
      console.error('Invalid Date object received:', date);
    }
  }

  saveAndClose(): void {
    const startTimeValue = this.composeForm.get('startTime').value;
    const endTimeValue = this.composeForm.get('endTime').value;
    const currentDate = new Date().toISOString().split('T')[0];
    const formattedStartTime = `${currentDate}T${startTimeValue}`;
    const formattedEndTime = `${currentDate}T${endTimeValue}`;
    this.composeForm.patchValue({
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });
    const dueDate = this.composeForm.get('dueDate').value;
    const taskTime = this.composeForm.get('tasktime').value;
    const combinedDateTime = this.combineDateAndTime(dueDate, taskTime);
    this.composeForm.patchValue({
      dueDate: combinedDateTime
    });


    this._leadService.saveCall(this.composeForm.value, this.lead.leadId)
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
  delete() {
    this._leadService.deleteCall(this.composeForm.value.callId, this.lead.leadId)
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.close())
  }
  
  close(): void {
    this.matDialogRef.close();
  }

  resetDueDate(): void {
    this.composeForm.get('dueDate').setValue(null);
    this.cdr.markForCheck()
  }

  resetCallDate(): void {
    this.composeForm.get('callDate').setValue(null);
    this.cdr.markForCheck()
  }

  isOverdue(date: string): boolean {
    return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
  }

}
