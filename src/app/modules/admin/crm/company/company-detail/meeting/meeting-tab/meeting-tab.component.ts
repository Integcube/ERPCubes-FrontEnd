import { Component, OnInit ,ChangeDetectionStrategy, ChangeDetectorRef, ViewChild} from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { MatDrawer } from '@angular/material/sidenav';
import { MeetingDetailComponent } from '../meeting-detail/meeting-detail.component';
import { CompanyService } from '../../../company.service';
import { Meeting } from '../../../company.type';

@Component({
  selector: 'app-meeting-tab',
  templateUrl: './meeting-tab.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class MeetingTabComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  meetings$ = this._companyService.meetings$;
  users$ = this._companyService.users$;
  meetingWithUser$ = combineLatest([
    this.meetings$,
    this.users$
  ])
  .pipe(
    map(([meetings, users]) =>
    meetings.map(meeting => ({
        ...meeting,
        createdByTitle:  users?.find(a=>a.id === meeting.createdBy)?.name,
      } as Meeting))
    )
  );
  constructor(
    private _companyService:CompanyService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }
  addMeeting(){
    let meeting = new Meeting({})
    // this._changeDetectorRef.markForCheck();
    this._matDialog.open(MeetingDetailComponent, {
      autoFocus: false,
      data     : {
          meeting: cloneDeep(meeting)
      }
  });
  }
  updateMeeting(meeting:Meeting):void{
    // this._changeDetectorRef.markForCheck();
    this._matDialog.open(MeetingDetailComponent, {
      autoFocus: false,
      data     : {
          meeting: cloneDeep(meeting)
      }
  });
  }
}
