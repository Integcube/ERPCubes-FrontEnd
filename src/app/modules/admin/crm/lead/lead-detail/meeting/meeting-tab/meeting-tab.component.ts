import { Component, OnInit ,ChangeDetectionStrategy, ChangeDetectorRef, ViewChild} from '@angular/core';
import { EMPTY, catchError, combineLatest, filter, map } from 'rxjs';
import { LeadService } from '../../../lead.service';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { MatDrawer } from '@angular/material/sidenav';
import { Meeting } from '../../../lead.type';
import { MeetingDetailComponent } from '../meeting-detail/meeting-detail.component';

@Component({
  selector: 'app-meeting-tab',
  templateUrl: './meeting-tab.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class MeetingTabComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  meetings$ = this._leadService.meetings$;
  users$ = this._leadService.users$;
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
  constructor(
    private _leadService:LeadService,
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
