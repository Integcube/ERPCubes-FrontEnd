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

  getDeletedFilters(): void {
    if (this._data.type === "LEAD") {
      this._trashService.getDeletedLeads().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }
    if (this._data.type === "PRODUCT") {
      this._trashService.getDeletedProducts().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }
    if (this._data.type === "USER") {
      this._trashService.getDeletedUsersList().subscribe((items: DeletedItems[]) => {
        this.deletedUsers = Array.from(new Set(items.map(item => item.deletedBy)));
      });
    }

  }


  ngOnInit(): void {
    this.getDeletedFilters();
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
    }
    else if (this._data.type === "PRODUCT") {
      this._trashService.restoreProduct(item).subscribe(data => { this.ngOnInit(); });
    }
    else if (this._data.type === "USER") {
      this._trashService.restoreUser(item).subscribe(data => { this.ngOnInit(); });
    }
  }


  restoreBulkItem(): void {
    if (this.isAnyItemSelected()) {
      const selectedItemIds = this.selectedItems.map(item => item?.id);
  
      let a;
      if (this._data.type === "LEAD") {
        a = this._trashService.restoreBulkLeads(selectedItemIds);
      } else if (this._data.type === "PRODUCT") {
        a = this._trashService.restoreBulkProduct(selectedItemIds);
      } else if (this._data.type === "USER") {
        a = this._trashService.restoreBulkUsers(selectedItemIds);
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

  filterByUser(user: string): void {
    if (this._data.type === "LEAD") {
      this._trashService.getDeletedLeads().pipe(
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
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }


}




