import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DeletedItems } from './trash.type';
import { Subject, takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TrashService } from './trash.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
})
export class TrashComponent implements OnInit, OnDestroy {
  @ViewChild('dropdownMenu') dropdownMenu: MatMenuTrigger;

  trashItems:DeletedItems[];
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selection = new SelectionModel<DeletedItems>(true, []);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _trashService:TrashService,
    private _matDialogRef: MatDialogRef<TrashComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { type: string },
  ) { }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // getDeletedFilters(): void {
  //   this._leadService.getDeletedLeads().subscribe((leads: DeletedLeads[]) => {
  //     this.deletedUsers = Array.from(new Set(leads.map(lead => lead.deletedBy)));
  //     this._changeDetectorRef.markForCheck();
  //   });
  // }

  ngOnInit(): void {
    if(this._data.type==="LEAD"){
      this._trashService.getDeletedLeads().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        data=>{this.trashItems=[...data]}
      )
    }
    else if(this._data.type==="USER"){
      debugger;
      this._trashService.getDeletedUsersList().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        data=>{this.trashItems=[...data]}
      )
    }
    else if(this._data.type==="PRODUCT"){
      this._trashService.getDeletedProducts().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        data=>{this.trashItems=[...data]}
      )
    }

    // this.searchInputControl.valueChanges
    //   .pipe(
    //     debounceTime(300), // Adjust debounce time as needed
    //     distinctUntilChanged(),
    //     takeUntil(this._unsubscribeAll)
    //   )
    //   .subscribe(searchTerm => {
    //     this.deletedLeads$ = this._leadService.getDeletedLeads().pipe(
    //       map(leads => leads.filter(lead =>
    //         lead.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    //       ))
    //     );

    //     this._changeDetectorRef.markForCheck();
    //   });
  }

  restoreItem(lead: DeletedItems): void {
    this._trashService.restoreUser(lead).subscribe(() => {
      this._trashService.getDeletedUsersList();
      // this._changeDetectorRef.markForCheck();
    });
  }


  // Update restoreBulkProduct method
  // restoreBulkLead(): void {
  //   if (this.isAnyLeadSelected()) {
  //     const selectedLeadIds = this.selectedLeads.map(lead => lead.leadId);

  //     this._leadService.restoreBulkLeads(selectedLeadIds).subscribe(() => {
  //       this.deletedLeads$ = this._leadService.getDeletedLeads();

  //       this._leadService.getDeletedLeads().subscribe((leads: DeletedLeads[]) => {
  //         this.dataSource.data = leads;
  //         this.selectedLeads = [];
  //         this._changeDetectorRef.markForCheck();
  //       });
  //     });

  //   }
  // }



  // selectedLeads: DeletedLeads[] = [];

  // toggleSelection(event: MatCheckboxChange, lead: DeletedLeads): void {
  //   if (event.checked) {
  //     this.selectedLeads.push(lead);
  //   } else {
  //     this.selectedLeads = this.selectedLeads.filter(selectedProduct => selectedProduct !== lead);
  //   }
  // }



  // isAnyLeadSelected(): boolean {
  //   return this.selectedLeads.length > 0;
  // }





  // closeDialog() {
  //   this._matDialogRef.close();

  //   this._allLeadService.getLeads().subscribe((allLeads: Lead[]) => {
  //     this.allLeads = [...allLeads];
  //     this.dataSourceLead = new MatTableDataSource(this.allLeads);
  //     this._changeDetectorRef.markForCheck();
  //   });
  // }

  // filterByUser(user: string): void {
  //   if (user === 'All Users') {
  //     this.deletedLeads$ = this._leadService.getDeletedLeads();
  //   } else {
  //     this.deletedLeads$ = this._leadService.getDeletedLeads().pipe(
  //       map(leads => leads.filter(lead => lead.deletedBy === user))
  //     );
  //   }
  //   this._changeDetectorRef.markForCheck();
  // }


}




