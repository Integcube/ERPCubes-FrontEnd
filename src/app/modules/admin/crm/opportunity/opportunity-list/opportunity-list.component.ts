import { SelectionModel } from '@angular/cdk/collections';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Observable, Subject, takeUntil, catchError, EMPTY, fromEvent, filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { Opportunity, OpportunityCustomList, OpportunityFilter, OpportunityStatus } from '../opportunity.types';
import { OpportunityService } from '../opportunity.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { TemplatePortal } from '@angular/cdk/portal';
import { User } from 'app/core/user/user.types';
import { ViewDetailComponent } from '../opportunity-detail/view/view-detail/view-detail.component';

@Component({
  selector: 'app-opportunity-list',
  templateUrl: './opportunity-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunityListComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('usersPanel') private _usersPanel: TemplateRef<any>;
  @ViewChild('usersPanelOrigin') private _usersPanelOrigin: ElementRef;
  @ViewChild('createdDatePanel') private _createdDatePanel: TemplateRef<any>;
  @ViewChild('createdDatePanelOrigin') private _createdDatePanelOrigin: ElementRef;
  @ViewChild('modifiedDatePanel') private _modifiedDatePanel: TemplateRef<any>;
  @ViewChild('modifiedDatePanelOrigin') private _modifiedDatePanelOrigin: ElementRef;
  @ViewChild('opportunityStatusPanel') private _opportunityStatusPanel: TemplateRef<any>;
  @ViewChild('opportunityStatusPanelOrigin') private _opportunityStatusPanelOrigin: ElementRef;
  private _usersPanelOverlayRef: OverlayRef;
  drawerMode: 'side' | 'over';
  dataSource: MatTableDataSource<Opportunity>;
  displayedColumns: string[] = ['select', 'name', 'email', 'phone', 'status', 'createdDate'];
  selection = new SelectionModel<Opportunity>(true, []);
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private errorMessageSubject = new Subject<string>();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  errorMessage$ = this.errorMessageSubject.asObservable();
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
  filter: OpportunityFilter = {
    opportunityOwner: [],
    createdDate: null,
    modifiedDate: null,
    opportunityStatus: []
  }
  opportunityList$: Observable<Opportunity[]>;
  opportunityList: Opportunity[];
  opportunityListCount: number = 0;
  selectedOpportunity: Opportunity;
  customList$ = this._opportunityService.customList$;
  customLists$ = this._opportunityService.customLists$;
  filteredUsers: User[]
  users: User[]
  filteredStatus: OpportunityStatus[]
  status: OpportunityStatus[]
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _opportunityService: OpportunityService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _renderer2: Renderer2,
    private _matDialog: MatDialog,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef
  ) { }
  ngOnInit(): void {
    this.dateRangesFilter=[...this.dateRanges];
    let selectedList = new OpportunityCustomList({});
    selectedList.listTitle = "All Opportunity"
    this._opportunityService.setCustomList(selectedList);
    this.opportunityList$ = this._opportunityService.filteredOpportunityList$;
    this._opportunityService.filteredOpportunityList$
      .pipe(takeUntil(this._unsubscribeAll),
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
        }))
      .subscribe((opportunity: Opportunity[]) => {
        this.opportunityList = [...opportunity];
        this.opportunityListCount = opportunity.length;
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
    this._opportunityService.users$
      .pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }))
      .subscribe((users: User[]) => {
        this.users = users;
        this.filteredUsers = this.users;
        this._changeDetectorRef.markForCheck();
      })
    this._opportunityService.opportunityStatus$
      .pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }))
      .subscribe((status: OpportunityStatus[]) => {
        this.status = status;
        this.filteredStatus = this.status;
        this._changeDetectorRef.markForCheck();
      })
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
  getOpportunity(list: OpportunityCustomList, name: string): void {
    if (list === null) {
      list = new OpportunityCustomList({});
      list.listTitle = name;
    }
    this.filter = list.filterParsed;
    this._opportunityService.setCustomList(list);
    this._opportunityService.setFilter(list.filterParsed);
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
  openOpportunityStatusPanel(): void {
    this._usersPanelOverlayRef = this._overlay.create({
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this._opportunityStatusPanelOrigin.nativeElement)
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
      this._renderer2.addClass(this._opportunityStatusPanelOrigin.nativeElement, 'panel-opened');
      this._usersPanelOverlayRef.overlayElement.querySelector('input').focus();
    });
    const templatePortal = new TemplatePortal(this._opportunityStatusPanel, this._viewContainerRef);
    this._usersPanelOverlayRef.attach(templatePortal);
    this._usersPanelOverlayRef.backdropClick().subscribe(() => {
      this._renderer2.removeClass(this._opportunityStatusPanelOrigin.nativeElement, 'panel-opened');
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
    let view = new OpportunityCustomList({});
    this._matDialog.open(ViewDetailComponent, {
      autoFocus: false,
      data: {
        view: view
      }
    });
  }
  updateView(view: OpportunityCustomList): void {
    this._matDialog.open(ViewDetailComponent, {
      autoFocus: false,
      data: {
        view: view
      }
    });
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
      this.filter.opportunityOwner = [];
    }
    else if (filterId == 2) {
      this.filter.createdDate = null;
    }
    else if (filterId == 3) {
      this.filter.modifiedDate = null;
    }
    else if (filterId == 4) {
      this.filter.opportunityStatus = [];
    }
    this._opportunityService.setFilter(this.filter);
  }
  saveFilter(list: OpportunityCustomList): any {
    this._opportunityService.saveCustomFilter(list.listId, list.listTitle, JSON.stringify(this.filter)).pipe(takeUntil(this._unsubscribeAll)).subscribe();
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
  filterOpportunityStatus(event): void {
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
  toggleOpportunityOwner(id: string): void {
    const opportunityOwnerIndex = this.filter.opportunityOwner.findIndex(userId => userId === id);
    if (opportunityOwnerIndex === -1) {
      this.filter.opportunityOwner.push(id);
    } else {
      this.filter.opportunityOwner.splice(opportunityOwnerIndex, 1);
    }
    this._opportunityService.setFilter(this.filter);
  }
  toggleOpportunityStatus(opportunityId: number): void {
    const opportunityOwnerIndex = this.filter.opportunityStatus.findIndex(a => a === opportunityId);
    if (opportunityOwnerIndex === -1) {
      this.filter.opportunityStatus.push(opportunityId);
    } else {
      this.filter.opportunityStatus.splice(opportunityOwnerIndex, 1);
    }
    this._opportunityService.setFilter(this.filter);
  }
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
    this._opportunityService.setFilter(this.filter);
    this._usersPanelOverlayRef.detach();
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
