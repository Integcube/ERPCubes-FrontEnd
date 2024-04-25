import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Pagination, PaginationView } from 'app/core/user/user.types';
import { Observable, Subject, map, merge, switchMap, takeUntil } from 'rxjs';
import { AssignChecklistService } from './assign-checklist.service';
import { AssignDialogComponent } from './assign-dialog/assign-dialog.component';
import { Assign, CheckListInfo } from './assign-checklist.type';
import { cloneDeep } from 'lodash';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'assign-checklist',
  templateUrl: './assign-checklist.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignChecklistComponent {
  
  @ViewChild(MatPaginator) _paginator: MatPaginator;
  @ViewChild(MatSort) _sort: MatSort;
 

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['select','referenceno', 'checkList', 'code','remarks', 'createdDate', 'createdByName','edit'];
  selection = new SelectionModel<any>(true, []);
  pagination: Pagination;
  paginationparm= new PaginationView({});
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  isLoading: boolean = false;
  AssignCheckList$: Observable<any[]>;
  AssignCheckList: any[];
  AssignCheckListCount: number = 0;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _dialog: MatDialog,
    private _assignChecklistService: AssignChecklistService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,

  ) { }
  ngOnInit(): void {
    this.AssignCheckList$ = this._assignChecklistService.AssignCheckList$
      .pipe(
        takeUntil(this._unsubscribeAll)
      );
    this.AssignCheckList$.subscribe((chk: any[]) => {
      this.AssignCheckList = [...chk];
      this.AssignCheckListCount = chk.length;
      this.dataSource = new MatTableDataSource(this.AssignCheckList);
      this._changeDetectorRef.markForCheck();
    });
    this._assignChecklistService.pagination$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((pagination: Pagination) => {
        this.pagination = pagination;
        this._changeDetectorRef.markForCheck();
    });
  }
    ngAfterViewInit() {
      if ( this._sort && this._paginator )
      {
  this._sort.sort({
    id          : '',
    start       : 'asc',
    disableClear: true
  });
  
  this._changeDetectorRef.markForCheck();
  this._sort.sortChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(() => {
        this._paginator.pageIndex = 0;
    });
      merge(this._sort.sortChange, this._paginator.page).pipe(
        switchMap(() => {
        this.paginationparm.pageIndex=this._paginator.pageIndex;
        this.paginationparm.pageSize=this._paginator.pageSize;
        this.paginationparm.active=this._sort.active;
        this.paginationparm.direction=this._sort.direction
        this._assignChecklistService.updatePaginationParam(this.paginationparm);
          this.isLoading = true;
          return this._assignChecklistService.getAssignCheckList();
        }),
        map(() => {
          this.isLoading = false;
        })
      ).subscribe();
      }
    }

assignNew(){
  let assign = new CheckListInfo({});
  this.assignCheckList(assign)
}

UpdateAssignCheck(assign){

    assign.userId = '-1';
  // this.assignCheckList(assign);
  this.editCheckList(assign);
}

editCheckList(assign:CheckListInfo){
    this._router.navigate([assign.execId], { relativeTo: this._activatedRoute });

}
    assignCheckList(assign:CheckListInfo){
      this._router.navigate([-1], { relativeTo: this._activatedRoute });
    }
    
    ngOnDestroy(): void {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
    }
    delete(chklist: Assign) {
      const confirmation = this._fuseConfirmationService.open({
        title: 'Delete Assign CheckList',
        message: 'Are you sure you want to delete this Assign CheckList? This action cannot be undone!',
        actions: {
          confirm: {
            label: 'Delete'
          }
        }
      });
    
      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {
        if (result === 'confirmed') {
         

          this._assignChecklistService.delete(chklist.execId).subscribe({
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
      this._assignChecklistService.assignCheckPointToLeads(row).subscribe()
    }
}
