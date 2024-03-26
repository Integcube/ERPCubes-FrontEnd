import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Checklist } from '../execute-checklist.type';



@Component({
  selector: 'execute-dialog',
  templateUrl: './execute-dialog.component.html',
  styleUrls: ['./execute-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExecuteDialogComponent {

  checklist = new Checklist({});

  constructor(
    private _matDialogRef: MatDialogRef<ExecuteDialogComponent>,
  ) { }

  closeDialog() {
    this._matDialogRef.close();
  }

  toggleStatus(cPId: number, statusId: number) {
    let status:number=-1;
    if (statusId === 1) {
      status =3;
    }
    else {
      status =1;
    }
    // this._leadService.updateTaskStatus(taskId,taskTitle,status,this.lead.leadId).pipe(takeUntil(this._unsubscribeAll)).subscribe(data=>{this._changeDetectorRef.markForCheck()})
  }

}
