import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { EMPTY, Observable, Subject, catchError, filter, map, startWith, takeUntil } from 'rxjs';
import { CampaignListComponent } from '../campaign-list/campaign-list.component';
import { Campaign, Source, Product } from '../campaign.type';
import { CampaignService } from '../campaign.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { User } from 'app/core/user/user.types';

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignFormComponent implements OnInit, OnDestroy {
  @ViewChild('title') private _titleField: ElementRef;
  campaigns: Campaign[];
  campaignForm: FormGroup;
  selectedCampaign: Campaign;
  products: Product[]
  sourcesz: Source[]
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  // private _productsPanelOverlayRef: OverlayRef;
  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    private _campaignListComponent: CampaignListComponent,
    private _campaignService: CampaignService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef
  ) { }
  ngOnInit(): void {
    this._campaignListComponent.matDrawer.open();
    this.campaignForm = this._formBuilder.group({
      campaignId: [, Validators.required],
      adAccountId: [, Validators.required],
      title: ['', Validators.required],
      productId: [, Validators.required],
      sourceId: [, Validators.required],
      budget: ['', Validators.required],
    });
    this._campaignService.products$.pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })).subscribe((products) => {
        this.products = products;
        this._changeDetectorRef.markForCheck();
      });
    this._campaignService.sources$.pipe(takeUntil(this._unsubscribeAll),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })).subscribe((sources) => {
      this.sourcesz = [...sources];
      this._changeDetectorRef.markForCheck();
    })
    this._campaignService.campaign$.pipe(
      takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
      )
      .subscribe(
        (campaign: Campaign) => {
          this._campaignListComponent.matDrawer.open();
          this.selectedCampaign = { ...campaign };
          this.campaignForm.patchValue(campaign, { emitEvent: false });
          this._changeDetectorRef.markForCheck();
      });
  }
  ngAfterViewInit(): void {
    this._campaignListComponent.matDrawer.openedChange
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(opened => opened)
      )
      .subscribe(() => {
        this._titleField.nativeElement.focus();
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._campaignListComponent.matDrawer.close();
  }
  saveCampaign() {
    this._campaignService.saveCampaign(this.campaignForm)
    .pipe(
      takeUntil(this._unsubscribeAll),
      catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    }))
    .subscribe((data) =>
        {
          this._changeDetectorRef.markForCheck();
          this.closeDrawer();
          this._campaignListComponent.onBackdropClicked();
        }
      );
      
  }
  deleteCampaignCall() {
    this.closeDrawer();
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Campaign',
      message: 'Are you sure you want to delete this campaign? This action cannot be undone!',
      actions: {
        confirm: {
          label: 'Delete'
        }
      }
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._campaignService.deleteCampaign(this.selectedCampaign.campaignId).pipe(takeUntil(this._unsubscribeAll),
          catchError(err => {
            this.errorMessageSubject.next(err);
            return EMPTY;
          })
        )
          .subscribe((isDeleted) => {
            if (!isDeleted) {
              return;
            }
          });

        this._changeDetectorRef.markForCheck();
      }
    });
  }
  onCampaignSourceSelected(event: MatAutocompleteSelectedEvent): void {
    debugger;
    const selectedCampaignSource = event.option.value ;
    this.campaignForm.get('sourceId').patchValue(selectedCampaignSource);
    this._changeDetectorRef.markForCheck();
  }
  // filterCampaignSource(val: any): Source[] {
  //   debugger;
  //   let v: string;
  //   if (val.name)
  //     v = val.name
  //   else
  //     v = val
  //   return this.sourcesz.filter(source =>
  //     source.sourceTitle.toLowerCase().indexOf(v?.toLowerCase()) === 0);
  // }
  onCampaignProductSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedCampaignProduct = event.option.value;
    debugger;

    this.campaignForm.get('productId').patchValue(selectedCampaignProduct);
    this._changeDetectorRef.markForCheck();
  }
  filterCampaignProduct(val: any): Product[] {
    debugger;
    let v: string;
    if (val.name)
      v = val.name
    else
      v = val
    return this.products.filter(prod =>
      prod.productName.toLowerCase().indexOf(v?.toLowerCase()) === 0);
  }

}
