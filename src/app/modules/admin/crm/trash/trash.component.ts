import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DeletedItems } from './trash.type';
import { Subject, debounceTime, distinctUntilChanged, finalize, map, takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TrashService } from './trash.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
})
export class TrashComponent implements OnInit, OnDestroy {
  @ViewChild('dropdownMenu') dropdownMenu: MatMenuTrigger;

  trashItems: DeletedItems[];
  filterItems: DeletedItems[];
  selectedItems: DeletedItems[] = [];

  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selection = new SelectionModel<DeletedItems>(true, []);
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  deletedUsers: string[] = [];
  constructor(
    private _trashService: TrashService,
    private _matDialogRef: MatDialogRef<TrashComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { type: string },
  ) { }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }



  ngOnInit(): void {
    this.getDeletedFilters();
    switch(this._data.type) {
      case "LEAD":
        this._trashService.getDeletedLeads()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          data => { this.trashItems = this.filterItems = [...data] }
        );
        break;
      case "COMPANY":
        this._trashService.getDeletedCompany()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          data => { this.trashItems = this.filterItems = [...data] }
        );
        break;
      case "OPPORTUNITY":
        this._trashService.getDeletedOpportunity()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          data => { this.trashItems = this.filterItems = [...data] }
        );
        break;
      case "USER":
        this._trashService.getDeletedUsersList()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          data => { this.trashItems = this.filterItems = [...data] }
        );
        break;
      case "PRODUCT":
        this._trashService.getDeletedProducts()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          data => { this.trashItems = this.filterItems = [...data] }
        );  
        break;
      case "NOTE":
        this._trashService.getDeletedNotes()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          data => { this.trashItems = this.filterItems = [...data] }
        );  
        break;
      case "TASK":
        this._trashService.getDeletedTask()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          data => { this.trashItems = this.filterItems = [...data] }
        );  
        break;
      case "TEAM":
        this._trashService.getDeletedTeam()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          data => { this.trashItems = this.filterItems = [...data] }
        );  
        break;
      case "CAMPAIGN":
        this._trashService.getDeletedCampaign()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          data => { this.trashItems = this.filterItems = [...data] }
        );  
        break;
      case "FORM":
        this._trashService.getDeletedForm()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          data => { this.trashItems = this.filterItems = [...data] }
        );  
        break;
      case "PROJECT":
        this._trashService.getDeletedProject()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            data => { this.trashItems = this.filterItems = [...data] }
          );
        break;
    }
    /** 
    if (this._data.type === "LEAD") {
      this._trashService.getDeletedLeads().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        data => { this.trashItems = this.filterItems = [...data] }
      )
    }
    else if (this._data.type === "USER") {
      this._trashService.getDeletedUsersList().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        data => { this.trashItems = this.filterItems = [...data] }
      )
    }
    else if (this._data.type === "PRODUCT") {
      this._trashService.getDeletedProducts().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        data => { this.trashItems = this.filterItems = [...data] }
      )
    }
    else if (this._data.type === "NOTE") {
      this._trashService.getDeletedNotes().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        data => { this.trashItems = this.filterItems = [...data] }
      )
    }
    else if (this._data.type === "TASK") {
      this._trashService.getDeletedTask().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        data => { this.trashItems = this.filterItems = [...data] }
      )
    }
    else if (this._data.type === "TEAM") {
      this._trashService.getDeletedTeam().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        data => { this.trashItems = this.filterItems = [...data] }
      )
    }
    else if (this._data.type === "CAMPAIGN") {
      this._trashService.getDeletedCampaign().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        data => { this.trashItems = this.filterItems = [...data] }
      )
    }
    else if (this._data.type === "FORM") {
      this._trashService.getDeletedForm().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        data => { this.trashItems = this.filterItems = [...data] }
      )
    }
    else if (this._data.type === "PROJECT") {
      this._trashService.getDeletedProject().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        data => { this.trashItems = this.filterItems = [...data] }
      )
    }
    */
    this.searchInputControl.valueChanges
      .pipe(
        debounceTime(300), // Adjust debounce time as needed
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(searchTerm => {
        if (searchTerm.length) {
          this.filterItems = this.trashItems.filter(a => a.title.includes(searchTerm))

        }
        else {
          this.filterItems = this.trashItems;
        }

      });
  }

  restoreItem(item: DeletedItems): void {
    if (this._data.type === "LEAD") {
      this._trashService.restoreLead(item).subscribe(data => { this.ngOnInit(); });
      this._trashService.showNotification('snackbar-success', 'Lead restored successfully', 'bottom', 'center');
    }
    else if (this._data.type === "COMPANY") {
      this._trashService.restoreCompany(item).subscribe(data => {this.ngOnInit(); });
      this._trashService.showNotification('snackbar-success', 'Company restored successfully', 'bottom', 'center');
    }
    else if (this._data.type === "OPPORTUNITY") {
      this._trashService.restoreOpportunity(item).subscribe(data => {this.ngOnInit(); });
      this._trashService.showNotification('snackbar-success', 'Opportunity restored successfully', 'bottom', 'center');
    }
    else if (this._data.type === "PRODUCT") {
      this._trashService.restoreProduct(item).subscribe(data => { this.ngOnInit(); });
      this._trashService.showNotification('snackbar-success', 'Products restored successfully', 'bottom', 'center');

    }
    else if (this._data.type === "USER") {
      this._trashService.restoreUser(item).subscribe(data => { this.ngOnInit(); });
      this._trashService.showNotification('snackbar-success', 'User restored successfully', 'bottom', 'center');

    }
    else if (this._data.type === "NOTE") {
      this._trashService.restoreNote(item).subscribe(data => { this.ngOnInit(); });
      this._trashService.showNotification('snackbar-success', 'Note restored successfully', 'bottom', 'center');

    }
    else if (this._data.type === "TASK") {
      this._trashService.restoreTask(item).subscribe(data => { this.ngOnInit(); });
      this._trashService.showNotification('snackbar-success', 'Task restored successfully', 'bottom', 'center');

    }
    else if (this._data.type === "TEAM") {
      this._trashService.restoreTeam(item).subscribe(data => { this.ngOnInit(); });
      this._trashService.showNotification('snackbar-success', 'Team restored successfully', 'bottom', 'center');

    }
    else if (this._data.type === "CAMPAIGN") {
      this._trashService.restoreCampaign(item).subscribe(data => { this.ngOnInit(); });
      this._trashService.showNotification('snackbar-success', 'Campaign restored successfully', 'bottom', 'center');

    }
    else if (this._data.type === "FORM") {
      this._trashService.restoreForm(item).subscribe(data => { this.ngOnInit(); });
      this._trashService.showNotification('snackbar-success', 'Form restored successfully', 'bottom', 'center');

    }
    else if (this._data.type === "PROJECT") {
      this._trashService.restoreProject(item).subscribe(data => { this.ngOnInit(); });
      this._trashService.showNotification('snackbar-success', 'Project restored successfully', 'bottom', 'center');

    }
  }


  restoreBulkItem(): void {
    debugger;
    if (this.isAnyItemSelected()) {
      const selectedItemIds = this.selectedItems.map(item => item?.id);
      debugger;
      let a;
      if (this._data.type === "LEAD") {
        a = this._trashService.restoreBulkLeads(selectedItemIds);
        this._trashService.showNotification('snackbar-success', 'Leads restored successfully', 'bottom', 'center');

      } else if (this._data.type === "COMPANY") {
        a = this._trashService.restoreBulkCompany(selectedItemIds);
        this._trashService.showNotification('snackbar-success', 'Companies restored successfully', 'bottom', 'center');

      } else if (this._data.type === "OPPORTUNITY") {
        a = this._trashService.restoreBulkOpportunity(selectedItemIds);
        this._trashService.showNotification('snackbar-success', 'Opportunities restored successfully', 'bottom', 'center');

      } else if (this._data.type === "PRODUCT") {
        a = this._trashService.restoreBulkProduct(selectedItemIds);
        this._trashService.showNotification('snackbar-success', 'Products restored successfully', 'bottom', 'center');

      } else if (this._data.type === "USER") {
        a = this._trashService.restoreBulkUsers(selectedItemIds);
        this._trashService.showNotification('snackbar-success', 'Users restored successfully', 'bottom', 'center');

      }
      else if (this._data.type === "NOTE") {
        a = this._trashService.restoreBulkNotes(selectedItemIds);
        this._trashService.showNotification('snackbar-success', 'Notes restored successfully', 'bottom', 'center');

      }
      else if (this._data.type === "TASK") {
        a = this._trashService.restoreBulkTasks(selectedItemIds);
        this._trashService.showNotification('snackbar-success', 'Tasks restored successfully', 'bottom', 'center');

      }
      else if (this._data.type === "TEAM") {
        a = this._trashService.restoreBulkTeam(selectedItemIds);
        this._trashService.showNotification('snackbar-success', 'Teams restored successfully', 'bottom', 'center');

      }
      else if (this._data.type === "CAMPAIGN") {
        a = this._trashService.restoreBulkCampaign(selectedItemIds);
        this._trashService.showNotification('snackbar-success', 'Campaigns restored successfully', 'bottom', 'center');

      }
      else if (this._data.type === "FORM") {
        a = this._trashService.restoreBulkForm(selectedItemIds);
        this._trashService.showNotification('snackbar-success', 'Forms restored successfully', 'bottom', 'center');

      }
      else if (this._data.type === "PROJECT") {
        a = this._trashService.restoreBulkProject(selectedItemIds);
        this._trashService.showNotification('snackbar-success', 'Projects restored successfully', 'bottom', 'center');

      }
      
      
  
      if (a) {
        a.pipe(
          finalize(() => {
            this.ngOnInit();
            this.selectedItems = []; 
          })
        ).subscribe();
      }
    }
  }

  toggleSelection(event: MatCheckboxChange, item: DeletedItems): void {
    if (event.checked) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem !== item);
    }
  }


  isAnyItemSelected(): boolean {
    return this.selectedItems.length > 0;
  }


  closeDialog() {
    this._matDialogRef.close();
  }



  getDeletedFilters(): void {
    if (this._data.type === "LEAD") {
      this._trashService.getDeletedLeads().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }
    else if (this._data.type === "COMPANY") {
      this._trashService.getDeletedCompany().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }
    else if (this._data.type === "OPPORTUNITY") {
      this._trashService.getDeletedOpportunity().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }
    else if (this._data.type === "PRODUCT") {
      this._trashService.getDeletedProducts().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }
    else if (this._data.type === "USER") {
      this._trashService.getDeletedUsersList().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }
    else if (this._data.type === "NOTE") {
      this._trashService.getDeletedNotes().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }
    else if (this._data.type === "TASK") {
      this._trashService.getDeletedTask().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }
    else if (this._data.type === "TEAM") {
      this._trashService.getDeletedTeam().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }
    else if (this._data.type === "CAMPAIGN") {
      this._trashService.getDeletedCampaign().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }
    else if (this._data.type === "FORM") {
      this._trashService.getDeletedForm().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }
    else if (this._data.type === "PROJECT") {
      this._trashService.getDeletedProject().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }



  }


  filterByUser(user: string): void {
    if (this._data.type === "LEAD") {
      this._trashService.getDeletedLeads().pipe(
        map(items => items.filter(item => item.deletedBy === user))
      ).subscribe(filteredItems => {
        this.filterItems = filteredItems;
      });
    } else if (this._data.type === "COMPANY") {
      this._trashService.getDeletedCompany().pipe(
        map(items => items.filter(item => item.deletedBy === user))
      ).subscribe(filteredItems => {
        this.filterItems = filteredItems;
      });
    } else if (this._data.type === "OPPORTUNITY") {
      this._trashService.getDeletedOpportunity().pipe(
        map(items => items.filter(item => item.deletedBy === user))
      ).subscribe(filteredItems => {
        this.filterItems = filteredItems;
      });
    } else if (this._data.type === "PRODUCT") {
      this._trashService.getDeletedProducts().pipe(
        map(items => items.filter(item => item.deletedBy === user))
      ).subscribe(filteredItems => {
        this.filterItems = filteredItems;
      });
    } else if (this._data.type === "USER") {
      this._trashService.getDeletedUsersList().pipe(
        map(items => items.filter(item => item.deletedBy === user))
      ).subscribe(filteredItems => {
        this.filterItems = filteredItems;
      });
    }
    else if (this._data.type === "NOTE") {
      this._trashService.getDeletedNotes().pipe(
        map(items => items.filter(item => item.deletedBy === user))
      ).subscribe(filteredItems => {
        this.filterItems = filteredItems;
      });
    }
    else if (this._data.type === "TASK") {
      this._trashService.getDeletedTask().pipe(
        map(items => items.filter(item => item.deletedBy === user))
      ).subscribe(filteredItems => {
        this.filterItems = filteredItems;
      });
    }
    else if (this._data.type === "TEAM") {
      this._trashService.getDeletedTeam().pipe(
        map(items => items.filter(item => item.deletedBy === user))
      ).subscribe(filteredItems => {
        this.filterItems = filteredItems;
      });
    }
    else if (this._data.type === "CAMPAIGN") {
      this._trashService.getDeletedCampaign().pipe(
        map(items => items.filter(item => item.deletedBy === user))
      ).subscribe(filteredItems => {
        this.filterItems = filteredItems;
      });
    }
    else if (this._data.type === "FORM") {
      this._trashService.getDeletedForm().pipe(
        map(items => items.filter(item => item.deletedBy === user))
      ).subscribe(filteredItems => {
        this.filterItems = filteredItems;
      });
    }
    else if (this._data.type === "PROJECT") {
      this._trashService.getDeletedProject().pipe(
        map(items => items.filter(item => item.deletedBy === user))
      ).subscribe(filteredItems => {
        this.filterItems = filteredItems;
      });
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }


}




