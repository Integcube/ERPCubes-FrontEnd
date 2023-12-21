import { SelectionModel } from '@angular/cdk/collections';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Observable, Subject, takeUntil, catchError, EMPTY, fromEvent, filter } from 'rxjs';
import { Opportunity } from '../opportunity.types';
import { OpportunityService } from '../opportunity.service';

@Component({
  selector: 'app-opportunity-list',
  templateUrl: './opportunity-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunityListComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  drawerMode: 'side' | 'over';
  dataSource: MatTableDataSource<Opportunity>;
  displayedColumns: string[] = ['select', 'name', 'email', 'phone', 'status', 'createdDate'];
  selection = new SelectionModel<Opportunity>(true, []);
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private errorMessageSubject = new Subject<string>();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  opportunityList$: Observable<Opportunity[]>;
  opportunityList: Opportunity[];
  opportunityListCount: number = 0;
  selectedOpportunity: Opportunity;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _opportunityService: OpportunityService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
  ) { }
  ngOnInit(): void {
    this.opportunityList$ = this._opportunityService.opportunityList$;
    this._opportunityService.opportunityList$
      .pipe(takeUntil(this._unsubscribeAll),
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
        }))
      .subscribe((opportunity: Opportunity[]) => {
        this.opportunityList = [...opportunity];
        this.opportunityListCount = this.opportunityList.length;
        this.dataSource = new MatTableDataSource(this.opportunityList);
        this.ngAfterViewInit();
        this._changeDetectorRef.markForCheck();
      });
    this._opportunityService.opportunity$
      .pipe(takeUntil(this._unsubscribeAll),
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
        }))
      .subscribe((opportunity: Opportunity) => {
        this.selectedOpportunity = opportunity;
        this._changeDetectorRef.markForCheck();
      });
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        this.selectedOpportunity = null;
        this._changeDetectorRef.markForCheck();
      }
    });
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'over';
        }
        else {
          this.drawerMode = 'over';
        }
        this._changeDetectorRef.markForCheck();
      });
    fromEvent(this._document, 'keydown')
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter<KeyboardEvent>(event =>
          (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
          && (event.key === '/') // '/'
        )
      )
      .subscribe(() => {
        this.createOpportunity();
      });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  onMouseEnter(row: Opportunity) {
    row.isHovered = true;
  }
  onMouseLeave(row: Opportunity) {
    row.isHovered = false;
  }
  createOpportunity() {
    let newOpportunity: Opportunity = new Opportunity({});
    this._opportunityService.selectedOpportunity(newOpportunity);
    this._router.navigate(['./', newOpportunity.opportunityId], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  previewOpportunity(selectedOpportunity: Opportunity) {
    this._opportunityService.selectedOpportunity(selectedOpportunity);
    this._router.navigate(['./', selectedOpportunity.opportunityId], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  updateOpportunity(row: Opportunity) {
    this._router.navigate(['detail-view', row.opportunityId], { relativeTo: this._activatedRoute });
  }
  onBackdropClicked(): void {
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
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
  checkboxLabel(row?: Opportunity): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.opportunityId + 1}`;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
