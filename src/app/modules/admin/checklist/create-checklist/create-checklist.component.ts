import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Checklist } from './create-checklist.type';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateChecklistService } from './create-checklist.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ChecklistDialogComponent } from './checklist-dialog/checklist-dialog.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'create-checklist',
  templateUrl: './create-checklist.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateChecklistComponent implements OnInit {
    displayedColumns: string[] = [ 'select', 'title', 'description', 'createdBy'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
      private _activatedRoute: ActivatedRoute,
      private _changeDetectorRef: ChangeDetectorRef,
      private _router: Router,
      private _dialog: MatDialog,
      private _checklistService: CreateChecklistService,
      private _fuseConfirmationService: FuseConfirmationService,
  
    ) { }
    dataSource: MatTableDataSource<Checklist>;
    checklistCount: number = 0;
    selectedChecklist: Checklist;
    checklist: Checklist;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
  
    checklists$: Observable<Checklist[]>;
    checklists: Checklist[];
    selection = new SelectionModel<Checklist>(true, []);
    ngOnInit(): void {
      this.dataSource = new MatTableDataSource<Checklist>([]);
      this.checklists$ = this._checklistService.checklists$;
      this._checklistService.checklists$.subscribe((checklists) => {
        this.checklistCount = checklists.length;
        this.dataSource.data = checklists;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    
        this._changeDetectorRef.markForCheck();
      });
    
      this._checklistService.getChecklist().subscribe();
    }
    
  
    toggleAllRows() {
      if (this.isAllSelected()) {
        this.selection.clear();
        return;
      }
      this.selection.select(...this.dataSource.data);
    }
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  
    checkboxLabel(row?: Checklist): string {
      if (!row) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.cLId + 1}`;
    }
  
    addChecklist(){
      let checklist = new Checklist({})
      // this._changeDetectorRef.markForCheck();
      const restoreDialogRef = this._dialog.open(ChecklistDialogComponent, {
          height: "100%",
          width: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
        autoFocus: false,
        data     : {
            note: cloneDeep(checklist)
        }
      });
      restoreDialogRef.afterClosed().subscribe((result) => {
        this._checklistService.getChecklist().pipe(takeUntil(this._unsubscribeAll)).subscribe();
      });
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    openCheckpointDialog(checklist: Checklist){
        const restoreDialogRef = this._dialog.open(ChecklistDialogComponent, {
            height: "100%",
            width: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
          autoFocus: false,
          data     : {
              note: cloneDeep(checklist)
          }
        });
        restoreDialogRef.afterClosed().subscribe((result) => {
          this._checklistService.getChecklist().pipe(takeUntil(this._unsubscribeAll)).subscribe();
        });
    }
  
  
  
}
