import { ChangeDetectorRef, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssignedCheckList, AssignedCheckPoint } from '../execute-checklist.type';
import { ExecuteChecklistService } from '../execute-checklist.service';
import { Subject, takeUntil } from 'rxjs';



@Component({
  selector: 'execute-dialog',
  templateUrl: './execute-dialog.component.html',
  styleUrls: ['./execute-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExecuteDialogComponent {

  checkPoints:AssignedCheckPoint[]=[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: { checklist: AssignedCheckList },
    private _matDialogRef: MatDialogRef<ExecuteDialogComponent>,
    private _changeDetectorRef:ChangeDetectorRef,

    private _checklistService:ExecuteChecklistService,
    

  ) 
  { 
    this._checklistService.getCheckpoint(_data.checklist.execId).subscribe(
      data=>{this.checkPoints = [...data]
    }
    )
  }

  closeDialog() {
    this._matDialogRef.close();
  }

  toggleStatus(cp) {
    let status: number = -1;
    if (cp.status === 1) {
      status = 0;
    } else {
      status = 1;
    }
    this._checklistService.setStatus(status, this._data.checklist.execId, cp.cpId).pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      this._checklistService.getCheckpoint(this._data.checklist.execId).subscribe(
        data=>{this.checkPoints = [...data]
      }
      )
    });
  }

  // toggleStatus(row) {
  //   let status:number=-1;
  //   if (row.status === 1) {
  //     status =0;
  //   }
  //   else {
  //     status =1;
  //   }
  //   debugger
  //   this._checklistService.setStatus(status,row.cpId,this._data.checklist.cLId).pipe(takeUntil(this._unsubscribeAll)).subscribe(data=>{
      
  //     this._changeDetectorRef.markForCheck()
  //   this._checklistService.getCheckpoint(this._data.checklist.cLId).subscribe();
  //   })
  // }

}
