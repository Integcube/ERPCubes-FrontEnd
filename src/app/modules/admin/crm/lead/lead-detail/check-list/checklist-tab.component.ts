import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { cloneDeep } from 'lodash';
import { combineLatest, map, catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { LeadService } from '../../lead.service';
import { Call, Lead } from '../../lead.type';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-checklist-tab',
  templateUrl: './checklist-tab.component.html'
})
export class checklistTabComponent implements OnInit {
    checkpoints$ = this._leadService.checkpoint$;
    lead: Lead;
    constructor(
      private _leadService: LeadService,
      private _changeDetectorRef:ChangeDetectorRef,
      // @Inject(MAT_DIALOG_DATA) private _data: { selected: Lead }
    ) {
      
  
     }
     private _unsubscribeAll: Subject<any> = new Subject<any>();
    ngOnInit(): void {
      this._leadService.lead$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
        this.lead = { ...data };
    });
    this._leadService.getcheckpoint(this.lead.leadId).subscribe();
    }
    
    toggleStatus(row) {
      let status:number=-1;
      if (row.status === 1) {
        status =0;
      }
      else {
        status =1;
      }
      this._leadService.setStatus(status,row.cpId,this.lead.leadId).pipe(takeUntil(this._unsubscribeAll)).subscribe(data=>{
        
        this._changeDetectorRef.markForCheck()
      this._leadService.getcheckpoint(this.lead.leadId).subscribe();
      })
    }
    ngOnDestroy(): void {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
    }
  }
  
