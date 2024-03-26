import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssignedCheckList, AssignedCheckPoint } from '../execute-checklist.type';
import { ExecuteChecklistService } from '../execute-checklist.service';



@Component({
  selector: 'execute-dialog',
  templateUrl: './execute-dialog.component.html',
  styleUrls: ['./execute-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExecuteDialogComponent {

  checkPoints:AssignedCheckPoint[]=[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: { checklist: AssignedCheckList },
    private _matDialogRef: MatDialogRef<ExecuteDialogComponent>,
    private _checklistService:ExecuteChecklistService

  ) { 
    this._checklistService.getCheckpoint(_data.checklist.execId).subscribe(
      data=>{this.checkPoints = [...data]
      debugger;}
    )
  }

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
