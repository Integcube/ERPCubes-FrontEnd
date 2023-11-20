import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Lead } from '../lead.type';
import { SelectionModel } from '@angular/cdk/collections';
import { DOCUMENT } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Observable, Subject, takeUntil, catchError, EMPTY, fromEvent, filter } from 'rxjs';
import { LeadService } from '../lead.service';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss']
})
export class LeadListComponent implements OnInit {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Lead>;
  displayedColumns: string[] = ['select', 'name', 'email', 'phone', 'leadStatus', 'createdDate'];
  selection = new SelectionModel<Lead>(true, []);

  leads$: Observable<Lead[]>;
  leads: Lead[];
  leadCount: number = 0;
  selectedLead: Lead;
  drawerMode: 'side' | 'over';
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  //Observables
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _leadService: LeadService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
  ) { }
  onMouseEnter(row: Lead) {
    row.isHovered = true;
  }
  onMouseLeave(row: Lead) {
    row.isHovered = false;
  }
  previewLead(row: Lead) {
    this._router.navigate(['detail-view', row.leadId], { relativeTo: this._activatedRoute });
  }
  ngOnInit(): void {
    //Get Lead List
    this.leads$ = this._leadService.leads$;
    this._leadService.leads$
      .pipe(takeUntil(this._unsubscribeAll),
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
        }))
      .subscribe((comapnies: Lead[]) => {
        this.leads = [...comapnies];
        this.leadCount = comapnies.length;
        this.dataSource = new MatTableDataSource(this.leads);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this._changeDetectorRef.markForCheck();
      });
    // Get selected Lead
    this._leadService.lead$
      .pipe(takeUntil(this._unsubscribeAll),
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
        }))
      .subscribe((Lead: Lead) => {
        this.selectedLead = Lead;
        this._changeDetectorRef.markForCheck();
      });
    // Subscribe to MatDrawer opened change
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        this.selectedLead = null;
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
        this.createLead();
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
  createLead() {
    // let newLead: Lead = cloneDeep(new Lead({}));
    // this._leadService.selectedLead(newLead);
    this._router.navigate(['./', -1], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  updateLead(selectedLead: Lead) {
    this._router.navigate(['./', selectedLead.leadId], { relativeTo: this._activatedRoute });
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
  checkboxLabel(row?: Lead): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.leadId + 1}`;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
