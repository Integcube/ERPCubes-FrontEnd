
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { cloneDeep } from 'lodash';
import { combineLatest, map, catchError, EMPTY } from 'rxjs';
import { LeadService } from '../../../lead.service';
import { CallDetailComponent } from '../call-detail/call-detail.component';
import { Call } from '../../../lead.type';

@Component({
  selector: 'app-call-tab',
  templateUrl: './call-tab.component.html'
})
export class CallTabComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  calls$ = this._leadService.calls$;
  users$ = this._leadService.users$;
  callWithUser$ = combineLatest([
    this.calls$,
    this.users$
  ]).pipe(
    map(([calls, users]) =>
    calls.map(call => ({
        ...call,
        callOwnerTitle : users?.find(a=>a.id === call.subject)?.name,
        createdByTitle:  users?.find(a=>a.id === call.createdBy)?.name,
      } as Call))
    ),
    catchError(error=>{alert(error);return EMPTY})
  );
  constructor(
    private _leadService:LeadService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }
  addCall(){
    debugger;
    let call = new Call({})
    // this._changeDetectorRef.markForCheck();
    this._matDialog.open(CallDetailComponent, {
      autoFocus: false,
      data     : {
          call: cloneDeep(call)
      }
  });
  }
  updateCall(call:Call):void{
    debugger;
    // this._changeDetectorRef.markForCheck();
    this._matDialog.open(CallDetailComponent, {
      autoFocus: false,
      data     : {
          call: cloneDeep(call)
      }
  });
  }

}
