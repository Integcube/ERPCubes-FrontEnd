import { Component, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { combineLatest, map, catchError, EMPTY, filter } from 'rxjs';
import { LeadService } from '../../../lead.service';
import { Tasks, TaskModel } from '../../../lead.type';

@Component({
  selector: 'app-task-tab',
  templateUrl: './task-tab.component.html',
  styleUrls: ['./task-tab.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TaskTabComponent implements OnInit {

  tasks$ = this._leadService.tasks$;
  users$ = this._leadService.users$;
  taskWithUser$ = combineLatest([
    this.tasks$,
    this.users$
  ]).pipe(
    map(([tasks, users]) =>
    tasks.map(task => ({
        ...task,
        taskOwnerTitle : users?.find(a=>a.id === task.taskOwner)?.name,
        createdByTitle:  users?.find(a=>a.id === task.createdBy)?.name,
      } as TaskModel))
    ),
    catchError(error=>{alert(error);return EMPTY})
  );
  filteredData$ = combineLatest([
    this._leadService.searchQuery$,
    this.taskWithUser$
  ]).pipe(
    map(([search, tasks]) => !search || !search.trim() ? tasks :
    tasks.filter(task => 
      task.taskTitle.toLowerCase().includes(search.trim().toLowerCase())
      )
    ),
  );
  constructor(
    private _leadService:LeadService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }
  addTask(){
    let tasks = new TaskModel({})
    this._matDialog.open(TaskDetailComponent, {
      autoFocus: false,
      data     : {
          task: cloneDeep(tasks)
      }
  });
  }
  updateTask(task:TaskModel):void{
    this._matDialog.open(TaskDetailComponent, {
      autoFocus: false,
      data     : {
        task: cloneDeep(task)
      }
  });
  }

}
