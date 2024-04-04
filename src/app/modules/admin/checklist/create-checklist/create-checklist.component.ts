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
    displayedColumns: string[] = [ 'select', 'title', 'description', 'createdBy', 'edit'];
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
  
    addChecklist(){
      this._router.navigate([-1], { relativeTo: this._activatedRoute });
     
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    openCheckpointDialog(checklist: Checklist){

        this._router.navigate([checklist.clId], { relativeTo: this._activatedRoute });
    }
  
    delete(selectedChecklist: Checklist) {

      const confirmation = this._fuseConfirmationService.open({
        title: 'Delete Checklist',
        message: 'Are you sure you want to delete this Checklist? This action cannot be undone!',
        actions: {
          confirm: {
            label: 'Delete'
          }
        }
      });
    
      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {
        if (result === 'confirmed') {
          this.selectedChecklist = selectedChecklist;
          const checklistIdToDelete = selectedChecklist.clId;
    
          this._checklistService.deleteChecklist(checklistIdToDelete).subscribe({
            next: () => {
              this._changeDetectorRef.markForCheck();
              
            },
            error: (error) => {
              console.error('Error deleting dashboard:', error);
            }
          });
        }
      });
    }
    AssigntoLead(row)
    {
      this._checklistService.assignCheckPointToLeads(row).subscribe()
    }
  
}
