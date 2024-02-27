import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { Call, Email, Meeting, Note, StatusLeads, StatusWiseLeads, TaskModel } from '../lead.type';
import { LeadService } from '../lead.service';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { CallDetailComponent } from '../lead-detail/call/call-detail/call-detail.component';
import { EmailDetailComponent } from '../lead-detail/email/email-detail/email-detail.component';
import { MeetingDetailComponent } from '../lead-detail/meeting/meeting-detail/meeting-detail.component';
import { NoteDetailComponent } from '../lead-detail/notes/note-detail/note-detail.component';
import { TaskDetailComponent } from '../lead-detail/tasks/task-detail/task-detail.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lead-status',
  templateUrl: './lead-status.component.html',
  styleUrls: ['./lead-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadStatusComponent implements OnInit, OnDestroy {

 statusWiseLeads:StatusWiseLeads[];
  // Private
  private readonly _positionStep: number = 65536;
  private readonly _maxListCount: number = 200;
  private readonly _maxPosition: number = this._positionStep * 500;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _leadService:LeadService,
      private _matDialog: MatDialog,
      private _router: Router,
      private _activatedRoute: ActivatedRoute,
  )
  {
  }

  ngOnInit(): void
  {
    this._leadService.getStatusWiseLeads().subscribe(
      data=>{this.statusWiseLeads = [...data]; this._changeDetectorRef.detectChanges()}
    )
  }


  ngOnDestroy(): void
  {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }


  // listDropped(event: CdkDragDrop<List[]>): void
  // {
  //     // Move the item
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

  //     // Calculate the positions
  //     const updated = this._calculatePositions(event);

  //     // Update the lists
  //     this._scrumboardService.updateLists(updated).subscribe();
  // }

  leadDropped(event: CdkDragDrop<StatusLeads[]>, title:string): void
  {
      // Move or transfer the item
      if ( event.previousContainer === event.container )
      {
          // Move the item
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      }
      else
      {
          // Transfer the item
          transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
          event.container.data[event.currentIndex].status = +event.container.id;
          let lead:StatusLeads = event.container.data[event.currentIndex];
          this._leadService.ChangeLeadStatus(lead.leadId, lead.status, title).pipe(takeUntil(this._unsubscribeAll)).subscribe();

      }

      // Calculate the positions
    //   const updated = this._calculatePositions(event);
      // Update the cards
    }

  updateLead(leadId: number) {
    this._router.navigate(['./', leadId], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  isOverdue(date: string): boolean
  {
      return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
  }

  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }
  previewLead(leadId: number) {
    this._router.navigate(['detail-view', leadId], { relativeTo: this._activatedRoute });
  }

  private _calculatePositions(event: CdkDragDrop<any[]>): any[]
  {
      // Get the items
      let items = event.container.data;
      const currentItem = items[event.currentIndex];
      const prevItem = items[event.currentIndex - 1] || null;
      const nextItem = items[event.currentIndex + 1] || null;

      // If the item moved to the top...
      if ( !prevItem )
      {
          // If the item moved to an empty container
          if ( !nextItem )
          {
              currentItem.position = this._positionStep;
          }
          else
          {
              currentItem.position = nextItem.position / 2;
          }
      }
      // If the item moved to the bottom...
      else if ( !nextItem )
      {
          currentItem.position = prevItem.position + this._positionStep;
      }
      // If the item moved in between other items...
      else
      {
          currentItem.position = (prevItem.position + nextItem.position) / 2;
      }

      // Check if all item positions need to be updated
      if ( !Number.isInteger(currentItem.position) || currentItem.position >= this._maxPosition )
      {
          // Re-calculate all orders
          items = items.map((value, index) => {
              value.position = (index + 1) * this._positionStep;
              return value;
          });

          // Return items
          return items;
      }

      // Return currentItem
      return [currentItem];
  }
  setSelectedLead(leadId:number){
        this._leadService.setSelectedLead(leadId);
  }
  addAction(leadId: number, action:string){
this.setSelectedLead(leadId);
    if(action==="Note"){
        this.addNote();
    }
    else if(action==="Task"){
        this.addTask();
    }
    else if(action==="Email"){
        this.addEmail();
    }
    else if(action==="Call"){
        this.addCall();
    }
    else if(action==="Meeting"){
        this.addMeeting();
    }
  }
  addNote(){
    let note = new Note({})
    this._matDialog.open(NoteDetailComponent, {
      autoFocus: false,
      data     : {
          note: cloneDeep(note)
      }
  });
  }
  addTask(){
    let tasks = new TaskModel({})
    this._matDialog.open(TaskDetailComponent, {
      autoFocus: false,
      data     : {
          task: cloneDeep(tasks)
      }
  });
  }
  addMeeting(){
    let meeting = new Meeting({})
    this._matDialog.open(MeetingDetailComponent, {
      autoFocus: false,
      data     : {
          meeting: cloneDeep(meeting)
      }
  });
  }
  addCall(){
    let call = new Call({})
    this._matDialog.open(CallDetailComponent, {
      autoFocus: false,
      data     : {
          call: cloneDeep(call)
      }
  });
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
  
}
