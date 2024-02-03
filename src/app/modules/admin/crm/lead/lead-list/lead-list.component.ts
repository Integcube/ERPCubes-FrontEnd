import { AfterViewInit, ChangeDetectorRef, Component,ChangeDetectionStrategy, ElementRef, Inject, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
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
import { Observable, Subject, takeUntil, fromEvent, filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { LeadService } from '../lead.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { User } from 'app/core/user/user.types';
import { MatDialog } from '@angular/material/dialog';
import { ViewDetailComponent } from '../lead-detail/view/view-detail/view-detail.component';
import { LeadImportComponent } from '../lead-import/lead-import.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { LeadRestoreComponent } from '../lead-restore/lead-restore.component';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class LeadListComponent implements OnInit,AfterViewInit {
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
  private _usersPanelOverlayRef: OverlayRef;
  dataSource: MatTableDataSource<Lead>;
  //'sourceTitle',,'country','companyTitle','industryTitle' ,'email'
  displayedColumns: string[] = ['select', 'name', 'rating','productTitle', 'phone', 'leadStatus','leadOwnerName', 'createdDate'];
  isTable: boolean = true
  selection = new SelectionModel<Lead>(true, []);
  customList$ = this._leadService.customList$;
  dateRangesFilter:any[];
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
  leadStatus:LeadStatus[];
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  

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
    public dialog: MatDialog
  ) { }

  activeItem= new LeadCustomList({});
  activeItemforAll=null;




  onDateRangeChange(selectedValue: string,type: string) {
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
    if(type=="created"){
      this.filter.createdDate=startDate;
    }
    else{
      this.filter.modifiedDate=startDate;
    }
    this._leadService.setFilter(this.filter);
    this._usersPanelOverlayRef.detach();
  }
  getLeads(list: LeadCustomList, name: string): void {

    if (list === null) {
      list = new LeadCustomList({});
      list.listTitle = name;
      this.activeItemforAll = null;
    }
    
    this.activeItem = list;
    this.filter = list.filterParsed;
    this._leadService.setCustomList(list);
    this._leadService.setFilter(list.filterParsed);
  }
  openModifiedDatePanel():void{
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
  openLeadStatusPanel():void{
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
  openCreatedDatePanel(): void{
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
  setView(){
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
  toggleView(){
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
    this.dateRangesFilter=[...this.dateRanges];
    let selectedList = new LeadCustomList({});
    selectedList.listTitle = "All leads"
    this._leadService.setCustomList(selectedList);
    this.leads$ = this._leadService.filteredLeads$;
    this._leadService.filteredLeads$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((comapnies: Lead[]) => {
        this.leads = [...comapnies];
        this.leadCount = comapnies.length;
        this.dataSource = new MatTableDataSource(this.leads);
        this.ngAfterViewInit();
        this._changeDetectorRef.markForCheck();
      });

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
  ngAfterViewInit(){
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
  importFile(){

  }

  isActiveItem(item:LeadCustomList): boolean {
    if(item==null)
    {
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
  filterLeadStatus(event):void{
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
  toggleLeadStatus(leadId:number):void{
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
  openRestoreDialog() {
    const restoreDialogRef = this.dialog.open(LeadRestoreComponent,
      {
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "100%"
      }
    );
  }
  // exportToExcel() {
  //   this.exporter.exportTable('xls', { fileName: 'Lead-list' });
  // }

}
