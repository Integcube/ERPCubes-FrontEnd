import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarService } from '../calendar.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CalendarEvent } from '../calendar.type';

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
  ngOnInit(): void {
    this.event = this._data.event
    this.eventForm = this._formBuilder.group({
      id: [this.event.id, Validators.required],
      title: [this.event.title, Validators.required],
      type: [this.event.type, Validators.required],
      start: [this.event.start, Validators.required],
      end: [this.event.end, Validators.required],
    });
    this._changeDetectorRef.markForCheck()
  }
  closeDialog() {
    this._matDialogRef.close();
  }
}
