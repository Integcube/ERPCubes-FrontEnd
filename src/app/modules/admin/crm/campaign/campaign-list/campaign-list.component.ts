import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CampaignService } from '../campaign.service';
import { EMPTY, Observable, Subject, combineLatest, filter, fromEvent, map, takeUntil } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatDrawer } from '@angular/material/sidenav';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Campaign } from '../campaign.type';
import { cA } from '@fullcalendar/core/internal-common';
import { MatDialog } from '@angular/material/dialog';
import { TrashComponent } from '../../trash/trash.component';
@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class CampaignListComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Campaign>;
  displayedColumns: string[] = ['Title', 'Product', 'Budget', 'Source'];
  selection = new SelectionModel<Campaign>(true, []);

  campaigns: Campaign[];
  campaignCount: number = 0;
  selectedCampaign: Campaign;

  drawerMode: 'side' | 'over';
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  


  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _campaignService: CampaignService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private dialog: MatDialog
  ) { }
  productNames$ = this._campaignService.products$
  sourceTitles$ = this._campaignService.sources$
  campaigns$ = this._campaignService.campaigns$
  campaignWithProductsSources$ = combineLatest(
    this.productNames$,
    this.sourceTitles$,
    this.campaigns$,
  ).pipe(
    map(([products, sources, campaigns]) => campaigns.map(r => ({
      ...r,
      productName: products.find(a => a.productId === r.productId)?.productName,
      sourceTitle: sources.find(b => b.sourceId === r.sourceId)?.sourceTitle,
    } as Campaign))))

  ngOnInit(): void {
    //Get campaign List
    this.campaignWithProductsSources$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((campaign: Campaign[]) => {
        this.campaigns = [...campaign];
        this.campaignCount = this.campaigns.length;
        this.dataSource = new MatTableDataSource(this.campaigns);
        this._changeDetectorRef.markForCheck();
      });
    // Get selected campaign
    this._campaignService.campaign$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((campaign: Campaign) => {
        this.selectedCampaign = campaign;
        this._changeDetectorRef.markForCheck();
      });
    // Subscribe to MatDrawer opened change
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        this.selectedCampaign = null;
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
        this.createCampaign();
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
  createCampaign() {
    let newCampaign:Campaign = new Campaign({});
    this._campaignService.selectedCampaign(newCampaign);
    this._router.navigate(['./', newCampaign.campaignId], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  updateCampaign(selectedCampaign:Campaign){
    this._campaignService.selectedCampaign(selectedCampaign);
    this._router.navigate(['./', selectedCampaign.campaignId], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  deleteRestoreCampaign(){
    this._campaignService.deleteCampaign(this.selectedCampaign.campaignId).subscribe();
    //this._changeDetectorRef.markForCheck();
  }
  onBackdropClicked(): void {
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onMouseEnter(row: Campaign){
    row.isHovered=true;
  }
  onMouseLeave(row: Campaign){
    row.isHovered=false;
  }
  // previewCampaign(row: Campaign) {
  //   this._router.navigate(['detail-view', row.campaignId], { relativeTo: this._activatedRoute });
  // }
  openTrashDialog() {
    const restoreDialogRef = this.dialog.open(TrashComponent,
      {
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
  
        autoFocus: false,
      data     : {
          type: "CAMPAIGN",
      }
      }
    );
    restoreDialogRef.afterClosed().subscribe((result) => {
      this._campaignService.getCampaign().pipe(takeUntil(this._unsubscribeAll)).subscribe();
    });
  }
}