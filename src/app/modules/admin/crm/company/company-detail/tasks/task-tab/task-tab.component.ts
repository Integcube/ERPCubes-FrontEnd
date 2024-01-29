import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { combineLatest, map, takeUntil, Subject } from 'rxjs';
import { Company, TaskModel } from '../../../company.type';
import { CompanyService } from '../../../company.service';

@Component({
  selector: 'app-task-tab',
  templateUrl: './task-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskTabComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  tasks$ = this._companyService.tasks$;
  users$ = this._companyService.users$;
  company: Company;
  taskWithUser$ = combineLatest([
    this.tasks$,
    this.users$
  ]).pipe(
    map(([tasks, users]) =>
      tasks.map(task => ({
        ...task,
        taskOwnerTitle: users?.find(a => a.id === task.taskOwner)?.name,
        createdByTitle: users?.find(a => a.id === task.createdBy)?.name,
      } as TaskModel))
    )
  );
  filteredData$ = combineLatest([
    this._companyService.searchQuery$,
    this.taskWithUser$
  ]).pipe(
    map(([search, tasks]) => !search || !search.trim() ? tasks :
      tasks.filter(task =>
        task.taskTitle.toLowerCase().includes(search.trim().toLowerCase())
      )
    ),
  );
  constructor(
    private _companyService: CompanyService,
    private _matDialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,

  ) { }
  ngOnInit(): void {
    this._companyService.company$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      this.company = { ...data }; this._changeDetectorRef.markForCheck();
    })
  }
  toggleStatus(taskId: number, statusId: number, taskTitle:string) {
    let status:number=-1;
    if (statusId === 1) {
      status =3;
    }
    else {
      status =1;
    }
    this._companyService.updateTaskStatus(taskId,taskTitle,status,this.company.companyId).pipe(takeUntil(this._unsubscribeAll)).subscribe(data=>{this._changeDetectorRef.markForCheck()})
  }
  togglePriority(taskId: number, priorityId: number, taskTitle: string, newPriority: number) {
    // Check if the new priority is different from the current priority
    if (priorityId !== newPriority) {
      this._companyService.updateTaskPriority(taskId, taskTitle, newPriority, this.company.companyId)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(data => {
          this._changeDetectorRef.markForCheck();
        });
    }
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  addTask() {
    let tasks = new TaskModel({})
    this._matDialog.open(TaskDetailComponent, {
      autoFocus: false,
      data: {
        task: cloneDeep(tasks)
      }
    });
  }
  updateTask(task: TaskModel): void {
    this._matDialog.open(TaskDetailComponent, {
      autoFocus: false,
      data: {
        task: cloneDeep(task)
      }
    });
  }

}
