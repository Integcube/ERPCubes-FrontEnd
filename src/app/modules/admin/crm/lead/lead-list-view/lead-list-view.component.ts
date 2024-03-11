import { AfterViewInit, ChangeDetectorRef, Component, ChangeDetectionStrategy, OnInit, ViewChild, Inject} from '@angular/core';
import { Lead, LeadCustomList, LeadStatus } from '../lead.type';
import { SelectionModel } from '@angular/cdk/collections';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject,fromEvent, takeUntil,filter, merge, switchMap, map } from 'rxjs';
import { LeadService } from '../lead.service';
import { Pagination, PaginationView, User } from 'app/core/user/user.types';
import { MatDialog } from '@angular/material/dialog';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-lead-list-view',
  templateUrl: './lead-list-view.component.html',
  styleUrls: ['./lead-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadListViewComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Lead>;

  displayedColumns: string[] = ['select', 'name', 'rating', 'productTitle', 'phone', 'leadStatus', 'leadOwnerName', 'createdDate'];

  selection = new SelectionModel<Lead>(true, []);
  paginationparm= new PaginationView({});
  pagination: Pagination;

  
  users: User[]
 
  drawerMode: 'side' | 'over';
  leads$: Observable<Lead[]>;
  leads: Lead[];
  leadCount: number = 0;
  selectedLead: Lead;

  searchInputControl: UntypedFormControl = new UntypedFormControl();
  isLoading: boolean = false;


  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _leadService: LeadService,
    public dialog: MatDialog,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    @Inject(DOCUMENT) private _document: any,
  ) { }

  activeItem = new LeadCustomList({});
  activeItemforAll = null;

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
   


     this.leads$ = this._leadService.filteredLeads$;
    this._leadService.leads$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((comapnies: Lead[]) => {
        this.leads = [...comapnies];
        this.leadCount = comapnies.length;
        this.dataSource = new MatTableDataSource(this.leads);
      
        this._changeDetectorRef.markForCheck();
      });
      this.ngAfterViewInit();
      this._leadService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: Pagination) => {
          this.pagination = pagination;
          this._changeDetectorRef.markForCheck();
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
        this.createLead();
      });


  }
  ngAfterViewInit() {
    if ( this.sort && this.paginator )
    {
    this.sort.sortChange.pipe(takeUntil(this._unsubscribeAll))
    .subscribe(() => {
        this.paginator.pageIndex = 0;
    });
    this.sort.sort({
      id          : 'firstName',
      start       : 'asc',
      disableClear: true
    });
      merge(this.sort.sortChange, this.paginator.page).pipe(
        switchMap(() => {
          debugger
        this.paginationparm.pageIndex=this.paginator.pageIndex;
        this.paginationparm.pageSize=this.paginator.pageSize;
        this.paginationparm.active= this.paginationparm.active = this.sort.active || ''; 
        this.paginationparm.direction=this.sort.direction= this.sort.direction || 'asc';
       
        this._leadService.updatePaginationParam(this.paginationparm);
          this.isLoading = true;
          this.selection.clear();
          return this._leadService.getLeads()
         
        }),
        map(() => {
          this.isLoading = false;
        })
      ).subscribe();
    }
   
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  createLead() {
    this._router.navigate(['./', -1], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  isActiveItem(item: LeadCustomList): boolean {
    if (item == null) {
      item = new LeadCustomList({});
      item.listTitle = "All Leads";

    }
    return this.activeItem === item;
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

    this._leadService.updateSelectedLeads( this.selection);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  activeFn(){
    this._leadService.updateSelectedLeads( this.selection);

  }
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
