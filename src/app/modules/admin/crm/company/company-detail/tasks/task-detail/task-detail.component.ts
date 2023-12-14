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
import { CompanyService } from '../../../company.service';
import { Company, Tag, TaskModel } from '../../../company.type';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailComponent implements OnInit, OnDestroy {

  taskForm: UntypedFormGroup;
  tags: Tag[];
  user: User;

  users$ = this._companyService.users$;
  selectedCompany: Company;
  filteredLabels: Tag[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  task: TaskModel;
  taskWithTag$ = combineLatest([
    this._companyService.task$,
    this._companyService.selectedTaskTag$,
  ]).pipe(
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
      dueDate: [null],
      taskOwner: [this.user.id, Validators.required]
    });

    this._companyService.company$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.selectedCompany = { ...data })
    if (this._data.task.taskId) {
      this._companyService.getTaskById(this._data.task.taskId).pipe(
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
          this.filteredLabels = this.tags;
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
