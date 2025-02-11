import { AfterViewInit, ChangeDetectorRef, Component, ChangeDetectionStrategy, ElementRef, Inject, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
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
import { Observable, Subject, takeUntil, fromEvent, filter, debounceTime, distinctUntilChanged, merge, switchMap, map } from 'rxjs';
import { LeadService } from '../lead.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Pagination, PaginationView, User } from 'app/core/user/user.types';
import { MatDialog } from '@angular/material/dialog';
import { ViewDetailComponent } from '../lead-detail/view/view-detail/view-detail.component';
import { LeadImportComponent } from '../lead-import/lead-import.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { TrashComponent } from '../../trash/trash.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadListComponent implements OnInit, AfterViewInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('exporter') public exporter;
  @ViewChild('usersPanel') private _usersPanel: TemplateRef<any>;
  @ViewChild('usersPanelOrigin') private _usersPanelOrigin: ElementRef;
  @ViewChild('createdDatePanel') private _createdDatePanel: TemplateRef<any>;
  @ViewChild('createdDatePanelOrigin') private _createdDatePanelOrigin: ElementRef;
  @ViewChild('modifiedDatePanel') private _modifiedDatePanel: TemplateRef<any>;
  @ViewChild('modifiedDatePanelOrigin') private _modifiedDatePanelOrigin: ElementRef;
  @ViewChild('leadStatusPanel') private _leadStatusPanel: TemplateRef<any>;
  @ViewChild('leadStatusPanelOrigin') private _leadStatusPanelOrigin: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu: MatMenuTrigger;

  @ViewChild('pnlstatusorgin') private _pnlstatusOrgin: ElementRef;
  @ViewChild('pnlstatus') private _Bulkpnlstatus: TemplateRef<any>;

  @ViewChild('pnluserorgin') private _pnluserOrgin: ElementRef;
  @ViewChild('pnluser') private _Bulkpnluser: TemplateRef<any>;


  private _usersPanelOverlayRef: OverlayRef;
  dataSource: MatTableDataSource<Lead>;

  displayedColumns: string[] = ['select', 'name', 'rating', 'productTitle', 'phone', 'leadStatus', 'leadOwnerName', 'createdDate'];
  isTable: boolean = true
  selection = new SelectionModel<Lead>(true, []);
  selectedLeads: SelectionModel<Lead>;
  paginationparm= new PaginationView({});
  pagination: Pagination;
  customList$ = this._leadService.customList$;
  dateRangesFilter: any[];
  dateRanges: { label: string, value: string }[] = [
    { label: 'Today', value: 'today' },
    { label: 'Last Week', value: 'lastWeek' },
    { label: 'Last 15 Days', value: 'last15Days' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'Last 4 Months', value: 'last4Months' },
    { label: 'Last 8 Months', value: 'last8Months' },
    { label: 'Last Year', value: 'lastYear' },
    { label: 'More Than a Year', value: 'moreThanYear' }
  ];
  filter: LeadFilter = {
    leadOwner: [],
    createdDate: null,
    modifiedDate: null,
    leadStatus: []
  }
  filteredUsers: User[]
  users: User[]
  filteredStatus: LeadStatus[]
  status: LeadStatus[]
  leads$: Observable<Lead[]>;
  leads: Lead[];
  leadCount: number = 0;
  selectedLead: Lead;
  drawerMode: 'side' | 'over';
  leadStatus: LeadStatus[];
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  isLoading: boolean = false;
  //For Bulk Option
  SeletedStatusBulk:number;
  SeletedStatusBulkTitle:string;
  SeletedLeadOwner:string;
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
    private _viewContainerRef: ViewContainerRef,
    public dialog: MatDialog,
    private _fuseConfirmationService: FuseConfirmationService,
  ) { }

  activeItem = new LeadCustomList({});
  onDateRangeChange(selectedValue: string, type: string) {
    let startDate: Date = new Date();
    let endDate: Date = new Date();
    switch (selectedValue) {
      case 'today':
        endDate.setDate(endDate.getDate() + 1);
        break;
      case 'lastWeek':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'last15Days':
        startDate.setDate(startDate.getDate() - 15);
        break;
      case 'lastMonth':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'last4Months':
        startDate.setMonth(startDate.getMonth() - 4);
        break;
      case 'last8Months':
        startDate.setMonth(startDate.getMonth() - 8);
        break;
      case 'lastYear':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 'moreThanYear':
        startDate.setFullYear(startDate.getFullYear() - 100);
        break;
      default:
        break;
    }
    if (type == "created") {
      this.filter.createdDate = startDate;
    }
    else {
      this.filter.modifiedDate = startDate;
    }
    this._leadService.setFilter(this.filter);
    this._usersPanelOverlayRef.detach();
  }
  getLeads(list: LeadCustomList, name: string): void {

    if (list === null) {
      list = new LeadCustomList({});
      list.listTitle = name;
    }
    this._leadService.updatePaginationParam(new PaginationView({}));
    this.activeItem = list;
     this.filter = list.filterParsed;
    this._leadService.setCustomList(list);
    this._leadService.setFilter(list.filterParsed);
  }
  openModifiedDatePanel(): void {
    this._usersPanelOverlayRef = this._overlay.create({
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this._modifiedDatePanelOrigin.nativeElement)
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
      this._renderer2.addClass(this._modifiedDatePanelOrigin.nativeElement, 'panel-opened');
      this._usersPanelOverlayRef.overlayElement.querySelector('input').focus();
    });
    const templatePortal = new TemplatePortal(this._modifiedDatePanel, this._viewContainerRef);
    this._usersPanelOverlayRef.attach(templatePortal);
    this._usersPanelOverlayRef.backdropClick().subscribe(() => {
      this._renderer2.removeClass(this._modifiedDatePanelOrigin.nativeElement, 'panel-opened');
      if (this._usersPanelOverlayRef && this._usersPanelOverlayRef.hasAttached()) {
        this._usersPanelOverlayRef.detach();
        this.dateRangesFilter = this.dateRanges;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
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
  openLeadStatusPanel(): void {
    this._usersPanelOverlayRef = this._overlay.create({
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this._leadStatusPanelOrigin.nativeElement)
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
      this._renderer2.addClass(this._leadStatusPanelOrigin.nativeElement, 'panel-opened');
      this._usersPanelOverlayRef.overlayElement.querySelector('input').focus();
    });
    const templatePortal = new TemplatePortal(this._leadStatusPanel, this._viewContainerRef);
    this._usersPanelOverlayRef.attach(templatePortal);
    this._usersPanelOverlayRef.backdropClick().subscribe(() => {
      this._renderer2.removeClass(this._leadStatusPanelOrigin.nativeElement, 'panel-opened');
      if (this._usersPanelOverlayRef && this._usersPanelOverlayRef.hasAttached()) {
        this._usersPanelOverlayRef.detach();
        this.filteredStatus = this.status;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }
  filterCreatedDate(event): void {
    const value = event.target.value.toLowerCase();
    fromEvent(event.target, 'input')
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.dateRangesFilter = this.dateRanges.filter(user =>
          user.label.toLowerCase().includes(value)
        );
      });
  }
  openCreatedDatePanel(): void {
    this._usersPanelOverlayRef = this._overlay.create({
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this._createdDatePanelOrigin.nativeElement)
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
      this._renderer2.addClass(this._createdDatePanelOrigin.nativeElement, 'panel-opened');
      this._usersPanelOverlayRef.overlayElement.querySelector('input').focus();
    });
    const templatePortal = new TemplatePortal(this._createdDatePanel, this._viewContainerRef);
    this._usersPanelOverlayRef.attach(templatePortal);
    this._usersPanelOverlayRef.backdropClick().subscribe(() => {
      this._renderer2.removeClass(this._createdDatePanelOrigin.nativeElement, 'panel-opened');
      if (this._usersPanelOverlayRef && this._usersPanelOverlayRef.hasAttached()) {
        this._usersPanelOverlayRef.detach();
        this.dateRangesFilter = this.dateRanges;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }
  addView() {
    let view = new LeadCustomList({});
    this._matDialog.open(ViewDetailComponent, {
      autoFocus: false,
      data: {
        view: view
      }
    });
  }
  setView() {
    this.isTable = !this.isTable
  }
  updateView(view: LeadCustomList): void {
    this._matDialog.open(ViewDetailComponent, {
      autoFocus: false,
      data: {
        view: view
      }
    });
  }
  toggleView() {
    this.isTable = !this.isTable
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
    this.dateRangesFilter = [...this.dateRanges];
    this._leadService.customList$.subscribe(selectedFilter => {
      this.activeItem = selectedFilter;
      this.filter=selectedFilter.filterParsed;

    });
    this._leadService.selectedLeads$.subscribe(selectedLeads => {
      this.selection = selectedLeads;
    });

    // selectedList.listTitle = "All leads"
    // this._leadService.setCustomList(selectedList);
    //  this.leads$ = this._leadService.filteredLeads$;
    // this._leadService.leads$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((comapnies: Lead[]) => {
    //     this.leads = [...comapnies];
    //     this.leadCount = comapnies.length;
    //     this.dataSource = new MatTableDataSource(this.leads);

    //     this._changeDetectorRef.markForCheck();
    //   });
      this.ngAfterViewInit();
      // this._leadService.pagination$
      // .pipe(takeUntil(this._unsubscribeAll))
      // .subscribe((pagination: Pagination) => {
      //     this.pagination = pagination;
      //     this._changeDetectorRef.markForCheck();
      // });

    this._leadService.lead$
      .pipe(takeUntil(this._unsubscribeAll))
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
   
  
  }

  ngAfterViewInit() {

    // if ( this.sort && this.paginator )
    // {
    // this.sort.sortChange.pipe(takeUntil(this._unsubscribeAll))
    // .subscribe(() => {
    //     // Reset back to the first page
    //     this.paginator.pageIndex = 0;
    // });

    // this.sort.sort({
    //   id          : 'firstName',
    //   start       : 'asc',
    //   disableClear: true
    // });

    //   merge(this.sort.sortChange, this.paginator.page).pipe(
    //     switchMap(() => {
    //       debugger
    //     this.paginationparm.pageIndex=this.paginator.pageIndex;
    //     this.paginationparm.pageSize=this.paginator.pageSize;
    //     this.paginationparm.active= this.paginationparm.active = this.sort.active || '';
    //     this.paginationparm.direction=this.sort.direction= this.sort.direction || 'asc';

    //     this._leadService.updatePaginationParam(this.paginationparm);
    //       this.isLoading = true;
    //       this.selection.clear();
    //       return this._leadService.getLeads()

    //     }),
    //     map(() => {
    //       this.isLoading = false;
    //     })
    //   ).subscribe();
    // }

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
    debugger
    if (item == null) {
      item = new LeadCustomList({});
      item.listTitle = "All Leads";

    }
    return this.activeItem === item;
  }


  // updateLead(selectedLead: Lead) {
  //   this._router.navigate(['./', selectedLead.leadId], { relativeTo: this._activatedRoute });
  //   this._changeDetectorRef.markForCheck();
  // }
  onBackdropClicked(): void {
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  // toggleAllRows() {
  //   if (this.isAllSelected()) {
  //     this.selection.clear();
  //     return;
  //   }
  //   this.selection.select(...this.dataSource.data);
  // }
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }
  // checkboxLabel(row?: Lead): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.leadId + 1}`;
  // }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  selectFn(selectedFilter:any[]){
    if(selectedFilter.length){

    }
  }
  cancelFilters(filterId: number): void {
    if (filterId == 1) {
      this.filter.leadOwner = [];
    }
    else if (filterId == 2) {
      this.filter.createdDate = null;
    }
    else if (filterId == 3) {
      this.filter.modifiedDate = null;
    }
    else if (filterId == 4) {
      this.filter.leadStatus = [];
    }
    this._leadService.setFilter(this.filter);
  }
  saveFilter(list: LeadCustomList): any {
    this._leadService.saveCustomFilter(list.listId, list.listTitle, JSON.stringify(this.filter)).pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }
  filterUsers(event): void {
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
  filterLeadStatus(event): void {
    const value = event.target.value.toLowerCase();
    fromEvent(event.target, 'input')
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filteredStatus = this.status.filter(s =>
          s.statusTitle.toLowerCase().includes(value)
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
  toggleLeadStatus(leadId: number): void {
    const leadOwnerIndex = this.filter.leadStatus.findIndex(a => a === leadId);
    if (leadOwnerIndex === -1) {
      this.filter.leadStatus.push(leadId);
    } else {
      this.filter.leadStatus.splice(leadOwnerIndex, 1);
    }
    this._leadService.setFilter(this.filter);
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  openConnectorDialog() {
    const dialogRef = this.dialog.open(LeadImportComponent,
      {
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "100%"
      }
    );
  }


  openTrashDialog() {
    const restoreDialogRef = this.dialog.open(TrashComponent,
      {
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "100%",

        autoFocus: false,
        data: {
          type: "LEAD",
        }
      }
    );
    restoreDialogRef.afterClosed().subscribe((result) => {
      this._leadService.getLeads().pipe(takeUntil(this._unsubscribeAll)).subscribe();
    });
  }

  openBulkStatusPanel(): void {
    this.SeletedStatusBulk=0;
    this._usersPanelOverlayRef = this._overlay.create({
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this._pnlstatusOrgin.nativeElement)
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

    // this._usersPanelOverlayRef.attachments().subscribe(() => {
    //   this._renderer2.addClass(this._pnlstatusOrgin.nativeElement, 'panel-opened');
    //   this._usersPanelOverlayRef.overlayElement.querySelector('input').focus();
    // });
    const templatePortal = new TemplatePortal(this._Bulkpnlstatus, this._viewContainerRef);
    this._usersPanelOverlayRef.attach(templatePortal);
    this._usersPanelOverlayRef.backdropClick().subscribe(() => {
      this._renderer2.removeClass(this._pnlstatusOrgin.nativeElement, 'panel-opened');
      if (this._usersPanelOverlayRef && this._usersPanelOverlayRef.hasAttached()) {
        this._usersPanelOverlayRef.detach();
        this.dateRangesFilter = this.dateRanges;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });

  }

  openBulkUserPanel(): void {
    this.SeletedLeadOwner="-1";
    this._usersPanelOverlayRef = this._overlay.create({
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this._pnluserOrgin.nativeElement)
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

    // this._usersPanelOverlayRef.attachments().subscribe(() => {
    //   this._renderer2.addClass(this._pnluserOrgin.nativeElement, 'panel-opened');
    //   this._usersPanelOverlayRef.overlayElement.querySelector('input').focus();
    // });
    const templatePortal = new TemplatePortal(this._Bulkpnluser, this._viewContainerRef);
    this._usersPanelOverlayRef.attach(templatePortal);
    this._usersPanelOverlayRef.backdropClick().subscribe(() => {
      this._renderer2.removeClass(this._pnluserOrgin.nativeElement, 'panel-opened');
      if (this._usersPanelOverlayRef && this._usersPanelOverlayRef.hasAttached()) {
        this._usersPanelOverlayRef.detach();
        this.filteredUsers = this.users;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }

  OpenDeletePop() {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Selected Leads',
      message: 'Are you sure you want to delete Selected leads? This action cannot be undone!',
      actions: {
        confirm: {
          label: 'Delete'
        }
      }
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {

        const SelectedLeadsId = this.selection.selected.map((lead: Lead) => {
          return { leadId: lead.leadId };
      });
        this._leadService.deleteBulkLeads(SelectedLeadsId).subscribe(
          {
            next: () => {
              this._changeDetectorRef.markForCheck();
              this.selection.clear();
            }
          }
        );
        const aa=this.selection.selected.map((lead: Lead) => lead.leadId);
      }
    });
  }

  SetStatusBulk(status,statusTitle) {
    this.SeletedStatusBulk=status;
    this.SeletedStatusBulkTitle=statusTitle;
  }

  SetAssignleads(Owner) {
    this.SeletedLeadOwner=Owner;
  }

  ChangeBulkStatus() {
        const SelectedLeadsId = this.selection.selected.map((lead: Lead) => {
          return { leadId: lead.leadId };});
        this._leadService.ChangeBulkLeadStaus(SelectedLeadsId,this.SeletedStatusBulk,this.SeletedStatusBulkTitle).subscribe(
          {
            next: () => {
              this._changeDetectorRef.markForCheck();
              this._usersPanelOverlayRef.detach();
              this.selection.clear();
            }
          }
        );
      }

      ChangeBulkAssignleads() {
        const SelectedLeadsId = this.selection.selected.map((lead: Lead) => {
          return { leadId: lead.leadId };});
        this._leadService.BulkLeadsAssign(SelectedLeadsId,this.SeletedLeadOwner).subscribe(
          {
            next: () => {
              this._changeDetectorRef.markForCheck();
              this._usersPanelOverlayRef.detach();
              this.selection.clear();
            }
          }
        );
      }
      Export(){
        this._leadService.Export();

      }

     
}
