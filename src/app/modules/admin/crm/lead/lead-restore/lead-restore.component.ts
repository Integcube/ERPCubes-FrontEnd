import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LeadService } from '../lead.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DeletedLead } from '../lead.type';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lead-restore',
  templateUrl: './lead-restore.component.html',
  styleUrls: [  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations     : fuseAnimations
})
export class LeadRestoreComponent implements OnInit {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  selection = new SelectionModel<DeletedLead>(true, []);
  
  
  
  deletedLead$: Observable<DeletedLead[]>;


  isLoading: boolean = false;
  deletedLeads: DeletedLead[]
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedLeads: DeletedLead[] | null = null;
  deletedLeads$ = this._leadService.deletedLeads$
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
      public matDialogRef: MatDialogRef<LeadRestoreComponent>,
      private _changeDetectorRef: ChangeDetectorRef,
      private _fuseConfirmationService: FuseConfirmationService,
      private _formBuilder: UntypedFormBuilder,
      private _leadService: LeadService
  )
  {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the brands
    this._leadService.getDeletedLeads()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((leads: DeletedLead[]) => {
      // Update the brands
      this.deletedLeads = leads;
      console.log(this.deletedLeads)
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void
  {
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  closeDialog() {
    this.matDialogRef.close()
  }

  /**
   * Restore the selected leads using the form data
   */
  restoreSelectedLeads(): void
  {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
        title  : 'Restore Leads',
        message: 'Are you sure you want to restore these Leads?',
        actions: {
            confirm: {
                label: 'Restore'
            }
        }
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {

        // If the confirm button pressed...
        if ( result === 'confirmed' )
        {
          debugger;
          //Get the product object
          this.selectedLeads = this.selection.selected
          const leads = this.selectedLeads;

          //Restore the product on the server
          this._leadService.restoreLeads(leads).subscribe(() => {

          // Close the details
          this.closeDialog();
          });
        }
    });
  }


  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.deletedLeads);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.deletedLeads.length;
    return numSelected === numRows;
  }
  checkboxLabel(row?: DeletedLead): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.leadId + 1}`;
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }

}
