import {ChangeDetectorRef, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeadService } from '../../../lead.service';
import { Lead } from 'app/modules/admin/dashboards/crm-dashboard/crm-dashboard.type';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'execute-dialog',
  templateUrl: './execute-dialog.component.html',
  styleUrls: ['./execute-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})


export class ExecuteDialogComponent {
  checkpoints$ = this._leadService.checkpoint$;
  constructor(
    private _matDialogRef: MatDialogRef<ExecuteDialogComponent>,
    private _leadService: LeadService,
    private _changeDetectorRef:ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { selected: Lead }
  ) {
    

   }
   private _unsubscribeAll: Subject<any> = new Subject<any>();
  ngOnInit(): void {

  }
  
  closeDialog() {
    this._matDialogRef.close();
  }
  toggleStatus(row) {
    let status:number=-1;
    if (row.status === 1) {
      status =0;
    }
    else {
      status =1;
    }
    debugger
    this._leadService.setStatus(status,row.cpId,this._data.selected.leadId).pipe(takeUntil(this._unsubscribeAll)).subscribe(data=>{
      
      this._changeDetectorRef.markForCheck()
    this._leadService.getcheckpoint(this._data.selected.leadId).subscribe();
    })
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
