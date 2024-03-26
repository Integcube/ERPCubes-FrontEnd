import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Checklist } from './execute-checklist.type';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateChecklistService } from '../create-checklist/create-checklist.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'execute-checklist',
  templateUrl: './execute-checklist.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExecuteChecklistComponent {

  displayedColumns: string[] = [ 'select', 'title', 'description', 'createdBy', 'createdDate'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _checklistService: CreateChecklistService,

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
  




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
