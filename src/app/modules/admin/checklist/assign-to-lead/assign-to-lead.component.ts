import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Checklist } from './assign-to-lead.type';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateChecklistService } from './assign-to-lead.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'assign-to-lead',
  templateUrl: './assign-to-lead.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignToLeadComponent implements OnInit {
    displayedColumns: string[] = [ 'select', 'title', 'description', 'createdBy', 'assignStatus'];
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
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.clId + 1}`;
    }
  

  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }


  AssigntoLead(row: any) {
      this._checklistService.assignCheckPointToLeads(row).subscribe(() => {
        this._checklistService.getChecklist().subscribe();

          this._changeDetectorRef.detectChanges();
      });


  }
  
  }
  
