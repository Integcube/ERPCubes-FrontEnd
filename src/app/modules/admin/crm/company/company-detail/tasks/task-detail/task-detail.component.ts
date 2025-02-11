import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, combineLatest, map, takeUntil } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { formatDate } from '@angular/common';
import { Company, Tag, TaskModel } from '../../../company.type';
import { CompanyService } from '../../../company.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailComponent implements OnInit, OnDestroy {

  taskForm: UntypedFormGroup;
  tags: Tag[];
  user: User;
  eventTypes$ = this._companyService.eventTypes$
  users$ = this._companyService.users$;
  selectedCompany: Company;
  filteredLabels: Tag[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  task: TaskModel;
  taskWithTag$ = combineLatest([
    this._companyService.task$,
    this._companyService.selectedTaskTag$,
  ])
  .pipe(
    map(([task, tags]) => ({
      ...task,
      tags: tags,
    } as TaskModel)),
  );
  constructor(
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { task: TaskModel },
    private _companyService: CompanyService,
    private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<TaskDetailComponent>
  ) { }

  ngOnInit(): void {
    this._userService.user$.subscribe(user => {
      this.user = user;
      this._changeDetectorRef.markForCheck();
    })
    this.taskForm = this._formBuilder.group({
      taskId: ['', Validators.required],
      taskTitle: ['', Validators.required],
      description: [''],
      tags: [[]],
      dueDate: null,
      dueTime: this.formatTime(this._data.task.dueDate),
      taskOwner: [this.user.id, Validators.required],
      tasktypeId: [''],
    });
    this._companyService.company$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.selectedCompany = { ...data })
    if (this._data.task.taskId) {
      this._companyService.getTaskById(this._data.task.taskId)
      .pipe(
        takeUntil(this._unsubscribeAll),
      )
      .subscribe(
        (data) => {
          this._changeDetectorRef.markForCheck();
        }
      );
      this.taskWithTag$
      .pipe(
        takeUntil(this._unsubscribeAll),
      )
      .subscribe(
        (data) => {
          this.taskForm.patchValue(data, { emitEvent: false });
          this.tags = cloneDeep(data.tags);
          this.filteredLabels = this.tags;
          this._changeDetectorRef.markForCheck();
        },
        error => {
          console.error("Error fetching data: ", error);
        }
      )
    }  
  }

  formatTime(time: string|Date): string {
    const date = new Date(time);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  }

  resetStartDate(): void {
    this.taskForm.get('start').setValue(null);
    this._changeDetectorRef.markForCheck()
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

  filterLabels(event): void {
    const value = event.target.value.toLowerCase();
    this.filteredLabels = this.tags.filter(label => label.tagTitle.toLowerCase().includes(value));
  }

  toggleProductTag(label: Tag, change: MatCheckboxChange): void {
    const foundLabelIndex = this.tags.findIndex(a => a.tagId === label.tagId);
    if (change.checked) {
      this.tags[foundLabelIndex].isSelected = true;
    } else {
      this.tags[foundLabelIndex].isSelected = false;
    }
  }

  save() {
    const dueDate = this.taskForm.get('dueDate').value
    const dueTime = this.taskForm.get('dueTime').value

    const formattedDateTime = `${formatDate(dueDate, "yyyy-MM-dd", "en")}T${dueTime}`

    this.taskForm.patchValue({
      dueDate: formattedDateTime,
    });

    let selectedIds: any[] = [];
    this.tags.map(a => {
      if (a.isSelected == true) {
        selectedIds.push(a.tagId);
      }
    })
    this.taskForm.get('tags').patchValue(selectedIds);
    this._companyService.saveTask(this.taskForm, this.selectedCompany.companyId).pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.closeDialog());
  }

  delete() {
    this._companyService.deleteTask(+this.taskForm.value.taskId, this.taskForm.value.taskTitle, this.selectedCompany.companyId).pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.closeDialog())
  }
}
