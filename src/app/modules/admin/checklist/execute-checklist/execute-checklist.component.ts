import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { ExecuteDialogComponent } from './execute-dialog/execute-dialog.component';
import { AssignedCheckList } from './execute-checklist.type';
import { ExecuteChecklistService } from './execute-checklist.service';

@Component({
  selector: 'execute-checklist',
  templateUrl: './execute-checklist.component.html',
  styleUrls: ['./execute-checklist.components.scss'],

  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExecuteChecklistComponent {

  displayedColumns: string[] = [ 'select','title','code','referenceno','description', 'createdBy', 'assignedDate'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _dialog: MatDialog,
    private _checklistService:ExecuteChecklistService
  ) { }
  dataSource: MatTableDataSource<AssignedCheckList>;
  checklistCount: number = 0;
  selectedChecklist: AssignedCheckList;
  checklist: AssignedCheckList;
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  checklists$: Observable<AssignedCheckList[]>;
  checklists: AssignedCheckList[];
  selection = new SelectionModel<AssignedCheckList>(true, []);
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<AssignedCheckList>([]);
    this.checklists$ = this._checklistService.checkList$;
    this._checklistService.checkList$.subscribe((checklists) => {
      this.checklistCount = checklists.length;
      this.dataSource.data = checklists;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this._changeDetectorRef.markForCheck();
    });
  
    this._checklistService.getChecklist().subscribe();
  }
  




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openChecklistDialog(selectedChecklist: AssignedCheckList): void {
    this._dialog.open(ExecuteDialogComponent, {
      panelClass: 'no-padding-dialog',
      height: '100%',
      width: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      autoFocus: false,
      data: {
        checklist: selectedChecklist,
      },
    });
  }

}
