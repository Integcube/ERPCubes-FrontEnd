import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CompanyService } from '../company.service';
import { Company, CompanyCustomList, CompanyFilter, Industry } from '../company.type';
import { EMPTY, Observable, Subject, debounceTime, distinctUntilChanged, filter, fromEvent, takeUntil } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatDrawer } from '@angular/material/sidenav';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ViewDetailComponent } from '../company-detail/view/view-detail/view-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { User } from 'app/core/user/user.types';
import { TemplatePortal } from '@angular/cdk/portal';
import { values } from 'lodash';

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
  @ViewChild('usersPanel') private _usersPanel: TemplateRef<any>;
  @ViewChild('usersPanelOrigin') private _usersPanelOrigin: ElementRef;
  @ViewChild('createdDatePanel') private _createdDatePanel: TemplateRef<any>;
  @ViewChild('createdDatePanelOrigin') private _createdDatePanelOrigin: ElementRef;
  @ViewChild('modifiedDatePanel') private _modifiedDatePanel: TemplateRef<any>;
  @ViewChild('modifiedDatePanelOrigin') private _modifiedDatePanelOrigin: ElementRef;
  @ViewChild('industryPanel') private _industryPanel: TemplateRef<any>;
  @ViewChild('industryPanelOrigin') private _industryPanelOrigin: ElementRef;
  private _panelsOverlayRef: OverlayRef;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  dataSource: MatTableDataSource<Company>;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  drawerMode: 'side' | 'over';
  displayedColumns: string[] = ['select', 'name', 'phone', 'billingCity', 'billingState', 'createdDate', 'billingCountry', 'companyIndustryId'];
  selection = new SelectionModel<Company>(true, []);
  customList$ = this._companyService.customList$
  customLists$ = this._companyService.customLists$
  filter: CompanyFilter = {
    companyOwner: [],
    createdDate: null,
    modifiedDate: null,
    industryId: []
  }
  dateRangesFilter: any;
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
  companies$: Observable<Company[]>;
  companies: Company[];
  companyCount: number = 0;
  selectedCompany: Company;
  users: User[];
  filteredUsers: User[]
  industries: Industry[]
  filteredIndustries: Industry[]
  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _companyService: CompanyService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _matDialog: MatDialog,
    private _renderer2: Renderer2,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.dateRangesFilter=[...this.dateRanges];
    let selectedList = new CompanyCustomList({});
    selectedList.listTitle = "All Companies"
    this._companyService.setCustomList(selectedList);
    this.companies$ = this._companyService.filteredCompanies$;
    this._companyService.filteredCompanies$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((comapnies: Company[]) => {
        this.companies = [...comapnies];
        this.companyCount = comapnies.length;
        this.dataSource = new MatTableDataSource(this.companies);
        setTimeout
        this.ngAfterViewInit();
        this._changeDetectorRef.markForCheck();
      });

    this._companyService.company$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((company: Company) => {
        this.selectedCompany = company;
        this._changeDetectorRef.markForCheck();
      });
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        this.selectedCompany = null;
        this._changeDetectorRef.markForCheck();
      }
    });
    this._companyService.users$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((users: User[]) => {
        this.users = users;
        this.filteredUsers = this.users;
        this._changeDetectorRef.markForCheck();
      })
    this._companyService.industries$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((industries: Industry[]) => {
        this.industries = industries;
        this.filteredIndustries = this.industries;
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
        this.createCompany();
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
  previewCompany(row: Company) {
    this._router.navigate(['detail-view', row.companyId], { relativeTo: this._activatedRoute });
  }
  getCompany(list: CompanyCustomList, name: string): void {
    if (list === null) {
      list = new CompanyCustomList({});
      list.listTitle = name;
    }
    this.filter = list.filterParsed;
    this._companyService.setCustomList(list);
    this._companyService.setFilter(list.filterParsed);
  }
  createCompany() {
    // let newCompany:Company = cloneDeep(new Company({}));
    // this._companyService.selectedCompany(newCompany);
    this._router.navigate(['./', -1], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  updateCompany(selectedCompany: Company) {
    // this._companyService.selectedCompany(selectedCompany);
    this._router.navigate(['./', selectedCompany.companyId], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  addView() {
    let view = new CompanyCustomList({});
    this._matDialog.open(ViewDetailComponent, {
      autoFocus: false,
      data: {
        view: view
      }
    });
  }
  updateView(view: CompanyCustomList): void {
    this._matDialog.open(ViewDetailComponent, {
      autoFocus: false,
      data: {
        view: view
      }
    });
  }
  onMouseEnter(row: Company) {
    row.isHovered = true;
  }
  onMouseLeave(row: Company) {
    row.isHovered = false;
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
  checkboxLabel(row?: Company): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.companyId + 1}`;
  }
  saveUpdateFilter(listId: number, listTitle: string) {
    
    this._companyService.saveCustomFilter(listId,listTitle, JSON.stringify(this.filter)).pipe(takeUntil(this._unsubscribeAll)).subscribe();
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
      this.filter.companyOwner = [];
    }
    else if (filterId == 2) {
      this.filter.createdDate = null;
    }
    else if (filterId == 3) {
      this.filter.modifiedDate = null;
    }
    else if (filterId == 4) {
      this.filter.industryId = [];
    }
    this._companyService.setFilter(this.filter);
  }
  filterUsers(event): void {
    const value = event.target.value.toLowerCase();
    fromEvent(event.target, 'input')
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(value))
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
  filterIndustries(event): void {
    const value = event.target.value.toLowerCase();
    fromEvent(event.target, 'input')
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filteredIndustries = this.industries.filter(industry => industry.industryTitle.toLowerCase().includes(value))
      })
  }
  toggleCompanyOwner(id: string): void {
    const leadOwnerIndex = this.filter.companyOwner.findIndex(userId => userId === id);
    if (leadOwnerIndex === -1) {
      this.filter.companyOwner.push(id);
    } else {
      this.filter.companyOwner.splice(leadOwnerIndex, 1);
    }
    this._companyService.setFilter(this.filter);
  }
  toggleIndustry(id: number): void {
    const industryIndex = this.filter.industryId.findIndex(industryId => industryId === id);
    if (industryIndex === -1) {
      this.filter.industryId.push(id);
    } else {
      this.filter.industryId.splice(industryIndex, 1);
    }
    this._companyService.setFilter(this.filter);
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
    this._companyService.setFilter(this.filter);
    this._panelsOverlayRef.detach();
  }
  openUsersPanel(): void {
    this._panelsOverlayRef = this._overlay.create({
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

    this._panelsOverlayRef.attachments().subscribe(() => {
      this._renderer2.addClass(this._usersPanelOrigin.nativeElement, 'panel-opened');
      this._panelsOverlayRef.overlayElement.querySelector('input').focus();
    });
    const templatePortal = new TemplatePortal(this._usersPanel, this._viewContainerRef);
    this._panelsOverlayRef.attach(templatePortal);
    this._panelsOverlayRef.backdropClick().subscribe(() => {
      this._renderer2.removeClass(this._usersPanelOrigin.nativeElement, 'panel-opened');
      if (this._panelsOverlayRef && this._panelsOverlayRef.hasAttached()) {
        this._panelsOverlayRef.detach();
        this.filteredUsers = this.users;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }
  openModifiedDatePanel(): void {
    this._panelsOverlayRef = this._overlay.create({
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

    this._panelsOverlayRef.attachments().subscribe(() => {
      this._renderer2.addClass(this._modifiedDatePanelOrigin.nativeElement, 'panel-opened');
      this._panelsOverlayRef.overlayElement.querySelector('input').focus();
    });
    const templatePortal = new TemplatePortal(this._modifiedDatePanel, this._viewContainerRef);
    this._panelsOverlayRef.attach(templatePortal);
    this._panelsOverlayRef.backdropClick().subscribe(() => {
      this._renderer2.removeClass(this._modifiedDatePanelOrigin.nativeElement, 'panel-opened');
      if (this._panelsOverlayRef && this._panelsOverlayRef.hasAttached()) {
        this._panelsOverlayRef.detach();
        this.dateRangesFilter = this.dateRanges;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }
  openCreatedDatePanel(): void {
    this._panelsOverlayRef = this._overlay.create({
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

    this._panelsOverlayRef.attachments().subscribe(() => {
      this._renderer2.addClass(this._createdDatePanelOrigin.nativeElement, 'panel-opened');
      this._panelsOverlayRef.overlayElement.querySelector('input').focus();
    });
    const templatePortal = new TemplatePortal(this._createdDatePanel, this._viewContainerRef);
    this._panelsOverlayRef.attach(templatePortal);
    this._panelsOverlayRef.backdropClick().subscribe(() => {
      this._renderer2.removeClass(this._createdDatePanelOrigin.nativeElement, 'panel-opened');
      if (this._panelsOverlayRef && this._panelsOverlayRef.hasAttached()) {
        this._panelsOverlayRef.detach();
        this.dateRangesFilter = this.dateRanges;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }
  openIndustryPanel(): void {
    this._panelsOverlayRef = this._overlay.create(
      {
        backdropClass: '',
        hasBackdrop: true,
        scrollStrategy: this._overlay.scrollStrategies.block(),
        positionStrategy: this._overlay.position()
          .flexibleConnectedTo(this._industryPanelOrigin.nativeElement)
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
    this._panelsOverlayRef.attachments().subscribe(() => {
      this._renderer2.addClass(this._industryPanelOrigin.nativeElement, 'panel-opened');
      this._panelsOverlayRef.overlayElement.querySelector('input').focus();
    });
    const templatePortal = new TemplatePortal(this._industryPanel, this._viewContainerRef);
    this._panelsOverlayRef.attach(templatePortal);
    this._panelsOverlayRef.backdropClick().subscribe(() => {
      this._renderer2.removeClass(this._industryPanelOrigin.nativeElement, 'panel-opened');
      if (this._panelsOverlayRef && this._panelsOverlayRef.hasAttached()) {
        this._panelsOverlayRef.detach();
        this.filteredIndustries = this.industries;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
