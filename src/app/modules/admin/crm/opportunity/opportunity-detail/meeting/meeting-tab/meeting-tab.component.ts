import { Component, OnInit ,ChangeDetectionStrategy, ChangeDetectorRef, ViewChild} from '@angular/core';
import { EMPTY, catchError, combineLatest, filter, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { MatDrawer } from '@angular/material/sidenav';
import { MeetingDetailComponent } from '../meeting-detail/meeting-detail.component';
import { OpportunityService } from '../../../opportunity.service';
import { Meeting } from '../../../opportunity.types';

@Component({
  selector: 'app-meeting-tab',
  templateUrl: './meeting-tab.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class MeetingTabComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  constructor(
    private _opportunityService: OpportunityService,
    private _matDialog: MatDialog )
  { }
  
  meetings$ = this._opportunityService.meetings$;
  users$ = this._opportunityService.users$;
  meetingWithUser$ = combineLatest([
    this.meetings$,
    this.users$
  ]).pipe(
    map(([meetings, users]) =>
    meetings.map(meeting => ({
        ...meeting,
        createdByTitle:  users?.find(a=>a.id === meeting.createdBy)?.name,
      } as Meeting))
    ),
    catchError(error=>{alert(error);return EMPTY})
  );
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
