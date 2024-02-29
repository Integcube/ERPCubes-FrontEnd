import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { cloneDeep } from 'lodash';
import { EMPTY, Subject, catchError, combineLatest, map, takeUntil } from 'rxjs';
import { EmailDetailComponent } from '../email-detail/email-detail.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Email, Opportunity } from '../../../opportunity.types';
import { OpportunityService } from '../../../opportunity.service';

@Component({
  selector: 'app-email-tab',
  templateUrl: './email-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailTabComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  constructor(
    private _opportunityService:OpportunityService,
    private _matDialog: MatDialog,
    private sanitizer: DomSanitizer,
    private _changeDetectorRef: ChangeDetectorRef,
    private matDialog: MatDialog
  ) { }
  
  opprtunity: Opportunity;
  emails$ = this._opportunityService.emails$;
  users$ = this._opportunityService.users$;
  emailWithUser$ = combineLatest([
    this.emails$,
    this.users$
  ]).pipe(
    map(([emails, users]) =>
    emails.map(email => ({
        ...email,
        createdByTitle:  users?.find(a=>a.id === email.createdBy)?.name,
      } as Email))
    ),
  );
  filteredData$ = combineLatest([
    this._opportunityService.searchQuery$,
    this.emailWithUser$
  ]).pipe(
    map(([search, emails]) => !search || !search.trim() ? emails :
    emails.filter(e =>
        e.subject.toLowerCase().includes(search.trim().toLowerCase())
      )
    ),
  );
  sanitizeHtml(htmlString: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }
  ngOnInit(): void {

  }
  addEmail(){
    let email = new Email({})
    this._matDialog.open(EmailDetailComponent, {
      autoFocus: false,
      data     : {
          email: cloneDeep(email)
      }
  });
  }
  updateEmail(email:Email):void{
    this._matDialog.open(EmailDetailComponent, {
      autoFocus: false,
      data     : {
          email: cloneDeep(email)
      }
  });
  }

}
