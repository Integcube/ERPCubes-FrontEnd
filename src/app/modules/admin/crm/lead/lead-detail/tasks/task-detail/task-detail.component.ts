import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, combineLatest, map, takeUntil } from 'rxjs';
import { LeadService } from '../../../lead.service';
import { Tag, TaskModel } from '../../../lead.type';
import { ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { cloneDeep, filter } from 'lodash';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailComponent implements OnInit, OnDestroy {

  taskForm: UntypedFormGroup;
  tags: Tag[];
  filteredLabels: Tag[];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  task: TaskModel;
  taskWithTag$ = combineLatest([
    this._leadService.task$,
    this._leadService.selectedTaskTag$,
  ]).pipe(
    map(([task, tags]) => ({
      ...task,
      tags: tags,
    } as TaskModel)),
  );
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { task: TaskModel },
    private _leadService: LeadService,
    private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<TaskDetailComponent>
  ) { }
  ngOnInit(): void {
    this.taskForm = this._formBuilder.group({
      taskId: ['', Validators.required],
      taskTitle: ['', Validators.required],
      description: [''],
      dueDate: [null]
    });
    if (this._data.task.taskId) {
      this._leadService.getTaskById(this._data.task.taskId).pipe(
        takeUntil(this._unsubscribeAll),
      ).subscribe(
        (data) => {
          this._changeDetectorRef.markForCheck();
        },
        error => {
          console.error("Error fetching data: ", error);
        }
      );
      this.taskWithTag$.pipe(
        takeUntil(this._unsubscribeAll),
      ).subscribe(
        (data) => {
          this.taskForm.patchValue(data, { emitEvent: false });
          this.tags = cloneDeep(data.tags);
          this.filteredLabels = cloneDeep(data.tags);
          this._changeDetectorRef.markForCheck();
        },
        error => {
          console.error("Error fetching data: ", error);
        }
      )
    }
  }
  resetDueDate(): void {
    this.taskForm.get('dueDate').setValue(null);
    this._changeDetectorRef.markForCheck()
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
  filterLabels(event): void
  {
      const value = event.target.value.toLowerCase();
      this.filteredLabels = this.tags.filter(label => label.tagTitle.toLowerCase().includes(value));
  }


}
