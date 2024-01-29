import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import moment from 'moment';
import { Subject } from 'rxjs';
import { StatusWiseLeads } from '../lead.type';
import { LeadService } from '../lead.service';

@Component({
  selector: 'app-lead-status',
  templateUrl: './lead-status.component.html',
  styleUrls: ['./lead-status.component.scss'],
  encapsulation  : ViewEncapsulation.None,
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
  )
  {
  }

  ngOnInit(): void
  {
    this._leadService.getStausWiseLeads().subscribe(
      data=>{this.statusWiseLeads = [...data]; }
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

  // cardDropped(event: CdkDragDrop<Card[]>): void
  // {
  //     // Move or transfer the item
  //     if ( event.previousContainer === event.container )
  //     {
  //         // Move the item
  //         moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //     }
  //     else
  //     {
  //         // Transfer the item
  //         transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

  //         // Update the card's list it
  //         event.container.data[event.currentIndex].listId = event.container.id;
  //     }

  //     // Calculate the positions
  //     const updated = this._calculatePositions(event);

  //     // Update the cards
  //     this._scrumboardService.updateCards(updated).subscribe();
  // }


  isOverdue(date: string): boolean
  {
      return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
  }

  trackByFn(index: number, item: any): any
  {
      return item.id || index;
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

}
