import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarService } from '../calendar.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CalendarEvent } from '../calendar.type';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-detail.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CalendarDetailComponent implements OnInit, OnDestroy {
  eventForm: UntypedFormGroup;
  event:CalendarEvent
  eventTypes$ = this._calendarService.eventTypes$
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: { event: CalendarEvent },
    private _matDialogRef: MatDialogRef<CalendarDetailComponent>,
    private _calendarService: CalendarService,
    private _formBuilder: UntypedFormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {

   }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  delete(){
    this._calendarService.deleteCalendar(this.eventForm.value.id, this.eventForm.value.title).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      data=>{this._changeDetectorRef.markForCheck();this.closeDialog()}
    )
  }
  save(){
    const startTimeValue = this.eventForm.get('startTime').value;
    const endTimeValue = this.eventForm.get('endTime').value;

    // Assuming that the date is the same for both start and end time, you may need to adjust this based on your requirements
    const startDate = this.eventForm.get('start').value;
    const endDate = this.eventForm.get('end').value;

    //const formattedDateTime = `${formatDate(dueDate, "yyyy-MM-dd", "en")}T${dueTime}`
    const formattedStartDateTime = `${formatDate(startDate, "yyyy-MM-dd", "en")}T${startTimeValue}`;
    const formattedEndDateTime = `${formatDate(endDate, "yyyy-MM-dd", "en")}T${endTimeValue}`;

    this.eventForm.patchValue({
      start: formattedStartDateTime,
      end: formattedEndDateTime,
    });

    this._calendarService.saveCalendar(this.eventForm.value).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      data=>{this._changeDetectorRef.markForCheck();this.closeDialog()}
    )
  }
  resetStartDate(): void {
    this.eventForm.get('start').setValue(null);
    this._changeDetectorRef.markForCheck();
  }
  resetEndDate():void{
    this.eventForm.get('end').setValue(null);
    this._changeDetectorRef.markForCheck()
  }
  formatTime(time: string|Date): string {
    const date = new Date(time);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  }

  ngOnInit(): void {
    this.event = this._data.event
    this.eventForm = this._formBuilder.group({
      id: [this.event.id, Validators.required],
      title: [this.event.title, Validators.required],
      type: [this.event.type, Validators.required],
      startTime: [this.formatTime(this.event.start)],
      endTime: [this.formatTime(this.event.end)],
      start: [formatDate(this._data.event.start, "yyyy-MM-dd", "en"), Validators.required],
      end: [formatDate(this._data.event.end, "yyyy-MM-dd", "en"), Validators.required],
   
    });
    this._changeDetectorRef.markForCheck()
  }
  closeDialog() {
    this._matDialogRef.close();
  }
}
