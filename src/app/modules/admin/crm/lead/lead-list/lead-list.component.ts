import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Lead, LeadCustomList, LeadFilter, LeadStatus } from '../lead.type';
import { SelectionModel } from '@angular/cdk/collections';
import { DOCUMENT } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Observable, Subject, takeUntil, catchError, EMPTY, fromEvent, filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { LeadService } from '../lead.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { User } from 'app/core/user/user.types';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ViewDetailComponent } from '../lead-detail/view/view-detail/view-detail.component';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss']
})
export class LeadListComponent implements OnInit, AfterViewInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('usersPanel') private _usersPanel: TemplateRef<any>;
  @ViewChild('usersPanelOrigin') private _usersPanelOrigin: ElementRef;
  private _usersPanelOverlayRef: OverlayRef;
  dataSource: MatTableDataSource<Lead>;
  displayedColumns: string[] = ['select', 'name', 'email', 'phone', 'leadStatus', 'createdDate'];
  selection = new SelectionModel<Lead>(true, []);
  customList$ = this._leadService.customList$;
  filter:LeadFilter={
    leadOwner: [],
    createdDate: null,
    modifiedDate: null,
    leadStatus: []
  }
  //Users
  filteredUsers: User[]
  users: User[]
  filteredUserArr:number[]=[]
  //Status
  filteredStatus: LeadStatus[]
  status: LeadStatus[]
  filteredStatusArr:number[]=[]
  leads$: Observable<Lead[]>;
  leads: Lead[];
  leadCount: number = 0;
  selectedLead: Lead;
  drawerMode: 'side' | 'over';
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  //Observables
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  customLists$ = this._leadService.customLists$;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _matDialog: MatDialog,
    private _router: Router,
    private _leadService: LeadService,
    private _renderer2: Renderer2,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef
  ) { }
  getLeads(list:LeadCustomList, name:string): void {
    if (list === null) {
      list = new LeadCustomList({});
      list.listTitle = name;
    }
      this.filter = list.filterParsed;
      this._leadService.setCustomList(list);
    this._leadService.setFilter(list.filterParsed);
  }
  openUsersPanel(): void {
    this._usersPanelOverlayRef = this._overlay.create({
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this._usersPanelOrigin.nativeElement)
        .withFlexibleDimensions(true)
        .withViewportMargin(64)
        .withLockedPosition(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top'
          }
        ])
    });

    this._usersPanelOverlayRef.attachments().subscribe(() => {
      this._renderer2.addClass(this._usersPanelOrigin.nativeElement, 'panel-opened');
      this._usersPanelOverlayRef.overlayElement.querySelector('input').focus();
    });
    const templatePortal = new TemplatePortal(this._usersPanel, this._viewContainerRef);
    this._usersPanelOverlayRef.attach(templatePortal);
    this._usersPanelOverlayRef.backdropClick().subscribe(() => {
      this._renderer2.removeClass(this._usersPanelOrigin.nativeElement, 'panel-opened');
      if (this._usersPanelOverlayRef && this._usersPanelOverlayRef.hasAttached()) {
        this._usersPanelOverlayRef.detach();
        this.filteredUsers = this.users;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }
  addView(){
    this._matDialog.open(ViewDetailComponent, {
      autoFocus: false,
      data     : {
      }
  });
  }
  updateView():void{
    this._matDialog.open(ViewDetailComponent, {
      autoFocus: false,
      data     : {
      }
  });
  }
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
    let selectedList = new LeadCustomList({});
    selectedList.listTitle = "All leads"
    this._leadService.setCustomList(selectedList);
    this.leads$ = this._leadService.filteredLeads$;
    this._leadService.filteredLeads$
      .pipe(takeUntil(this._unsubscribeAll),
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
        }))
      .subscribe((comapnies: Lead[]) => {
        this.leads = [...comapnies];
        this.leadCount = comapnies.length;
        this.dataSource = new MatTableDataSource(this.leads);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.ngAfterViewInit();
        this._changeDetectorRef.markForCheck();
      });

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

    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        this.selectedLead = null;
        this._changeDetectorRef.markForCheck();
      }
    });

    this._leadService.users$.pipe(takeUntil(this._unsubscribeAll))
    .subscribe((users: User[]) => {
      this.users = users;
      this.filteredUsers = this.users;
      this._changeDetectorRef.markForCheck();
    })

    this._leadService.leadStatus$.pipe(takeUntil(this._unsubscribeAll))
    .subscribe((status: LeadStatus[]) => {
      this.status = status;
      this.filteredStatus = this.status;
      this._changeDetectorRef.markForCheck();
    })

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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  createLead() {
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
  cancelFilters(filterId:number): void{
    if(filterId == 1){
      this.filter.leadOwner = [];     
    }
    else if(filterId == 2){
      this.filter.createdDate = null;     
    }
    else if(filterId == 3){
      this.filter.modifiedDate = null;     
    }
    else if(filterId == 4){
      this.filter.leadStatus = [];     
    }
    this._leadService.setFilter(this.filter);
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
  filterUsers(event): void
  {
    const value = event.target.value.toLowerCase();
    fromEvent(event.target, 'input')
      .pipe(
        debounceTime(300), 
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filteredUsers = this.users.filter(user =>
          user.name.toLowerCase().includes(value)
        );
      });
  }
  toggleProductTag(id: string): void {
    const leadOwnerIndex = this.filter.leadOwner.findIndex(userId => userId === id);
    if (leadOwnerIndex === -1) {
      this.filter.leadOwner.push(id);
    } else {
      this.filter.leadOwner.splice(leadOwnerIndex, 1);
    }
    this._leadService.setFilter(this.filter);
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
