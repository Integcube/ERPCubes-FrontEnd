import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../company.service';
import { Company } from '../company.type';
import { EMPTY, Observable, Subject, catchError, filter, fromEvent, takeUntil } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatDrawer } from '@angular/material/sidenav';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyListComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Company>;
  displayedColumns: string[] = ['select', 'name', 'phone', 'billingCity', 'billingState', 'createdDate', 'billingCountry', 'companyIndustryId'];
  selection = new SelectionModel<Company>(true, []);

  companies$: Observable<Company[]>;
  companies: Company[];
  companyCount: number = 0;
  selectedCompany: Company;
  drawerMode: 'side' | 'over';
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _companyService: CompanyService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
  ) { }

  ngOnInit(): void {
    //Get company List
    this.companies$ = this._companyService.companies$;
    this._companyService.companies$
      .pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }))
      .subscribe((comapnies: Company[]) => {
        this.companies = [...comapnies];
        this.companyCount = comapnies.length;
        this.dataSource = new MatTableDataSource(this.companies);
        this._changeDetectorRef.markForCheck();
      });
    // Get selected company
    this._companyService.company$
      .pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }))
      .subscribe((company: Company) => {
        this.selectedCompany = company;
        this._changeDetectorRef.markForCheck();
      });
    // Subscribe to MatDrawer opened change
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        this.selectedCompany = null;
        this._changeDetectorRef.markForCheck();
      }
    });
    // Subscribe to media changes
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

    // Listen for shortcuts
    fromEvent(this._document, 'keydown')
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter<KeyboardEvent>(event =>
          (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
          && (event.key === '/') // '/'
        )
      )
      .subscribe(() => {
        this.createCompany();
      });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  createCompany() {
    let newCompany:Company = new Company({});
    this._companyService.selectedCompany(newCompany);
    this._router.navigate(['./', newCompany.companyId], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  updateCompany(selectedCompany:Company){
    this._companyService.selectedCompany(selectedCompany);
    this._router.navigate(['./', selectedCompany.companyId], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
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
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Company): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.companyId + 1}`;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
