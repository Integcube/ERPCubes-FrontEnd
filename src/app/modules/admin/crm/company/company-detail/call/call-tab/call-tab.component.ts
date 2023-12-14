import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { cloneDeep } from 'lodash';
import { combineLatest, map, catchError, EMPTY } from 'rxjs';
import { CallDetailComponent } from '../call-detail/call-detail.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CompanyService } from '../../../company.service';
import { Call } from '../../../company.type';

@Component({
  selector: 'app-call-tab',
  templateUrl: './call-tab.component.html'
})
export class CallTabComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  calls$ = this._companyService.calls$;
  users$ = this._companyService.users$;
  callWithUser$ = combineLatest([
    this.calls$,
    this.users$
  ]).pipe(
    map(([calls, users]) =>
    calls.map(call => ({
        ...call,
        createdByTitle:  users?.find(a=>a.id === call.createdBy)?.name,
      } as Call))
    ),
    catchError(error=>{alert(error);return EMPTY})
  );
  filteredData$ = combineLatest([
    this._companyService.searchQuery$,
    this.callWithUser$
  ]).pipe(
    map(([search, calls]) => !search || !search.trim() ? calls :
    calls.filter(e =>
        e.subject.toLowerCase().includes(search.trim().toLowerCase())
      )
    ),
  );
  constructor(
    private _companyService:CompanyService,
    private _matDialog: MatDialog,
    private sanitizer: DomSanitizer
  ) { }
  sanitizeHtml(htmlString: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }
  ngOnInit(): void {
  }
  addCall(){
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
    // this._changeDetectorRef.markForCheck();
    this._matDialog.open(CallDetailComponent, {
      autoFocus: false,
      data     : {
          call: cloneDeep(call)
      }
  });
  }

}
