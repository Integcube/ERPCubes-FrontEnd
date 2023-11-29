import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { cloneDeep } from 'lodash';
import { EMPTY, catchError, combineLatest, map } from 'rxjs';
import { LeadService } from '../../../lead.service';
import { EmailDetailComponent } from '../email-detail/email-detail.component';
import { Email } from '../../../lead.type';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-email-tab',
  templateUrl: './email-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailTabComponent implements OnInit {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  emails$ = this._leadService.emails$;
  users$ = this._leadService.users$;
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
    this._leadService.searchQuery$,
    this.emailWithUser$
  ]).pipe(
    map(([search, emails]) => !search || !search.trim() ? emails :
    emails.filter(e =>
        e.subject.toLowerCase().includes(search.trim().toLowerCase())
      )
    ),
  );
  constructor(
    private _leadService:LeadService,
    private _matDialog: MatDialog,
    private sanitizer: DomSanitizer
  ) { }
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
