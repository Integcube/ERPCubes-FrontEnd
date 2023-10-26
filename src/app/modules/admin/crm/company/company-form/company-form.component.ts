import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { EMPTY, Subject, catchError, filter, takeUntil } from 'rxjs';
import { CompanyListComponent } from '../company-list/company-list.component';
import { Company } from '../company.type';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyFormComponent implements OnInit {
  @ViewChild('name') private _titleField: ElementRef;
  private companySubject = new Subject<Company>();
  company$ = this.companySubject.asObservable();
  companyForm: FormGroup;
  editMode: boolean = false;
  selectedCompany: Company;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  constructor(
    private _formBuilder: FormBuilder,
    private _companyListComponent: CompanyListComponent,
    private _companyService: CompanyService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this._companyListComponent.matDrawer.open();
    this.company$ = this._companyService.company$;
    this._companyService.company$.pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }))
      .subscribe((company: Company) => {
        this._companyListComponent.matDrawer.open();
        this.selectedCompany = { ...company };
        this.companyForm.patchValue(company, { emitEvent: false });
        this._changeDetectorRef.markForCheck();
      });
    this.companyForm = this._formBuilder.group({
      companyId: [this.selectedCompany.companyId, Validators.required],
      name: [this.selectedCompany.name],
      website: [this.selectedCompany.website],
      salesOwner: [this.selectedCompany.salesOwner],
      companyIndustryId: [this.selectedCompany.companyIndustryId],
      companySourceId: [this.selectedCompany.companySourceId],
      billingCity: [this.selectedCompany.billingCity],
      billingState: [this.selectedCompany.billingState],
      billingZIP: [this.selectedCompany.billingZIP],
      billingCountry: [this.selectedCompany.billingCountry],
      work: [this.selectedCompany.work],
    });

  }
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._companyListComponent.matDrawer.close();
  }
  ngAfterViewInit(): void {
    // Listen for matDrawer opened change
    this._companyListComponent.matDrawer.openedChange
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(opened => opened)
      )
      .subscribe(() => {
        // Focus on the title element
        this._titleField.nativeElement.focus();
      });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  save() {
    this.closeDrawer();
  }
  delete() {
    this.closeDrawer();

  }
}
