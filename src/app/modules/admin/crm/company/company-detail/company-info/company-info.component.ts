import { ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, catchError, EMPTY, Subject } from 'rxjs';
import { CompanyService } from '../../company.service';
import { Company } from '../../company.type';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyInfoComponent implements OnInit, OnDestroy {
  selectedCompany: Company;
  companyForm: FormGroup;
  users$ = this._companyService.users$;
  industries$ = this._companyService.industries$;
  private errorMessageSubject = new Subject<string>();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private companySubject = new Subject<Company>();
  company$ = this.companySubject.asObservable();
  errorMessage$ = this.errorMessageSubject.asObservable();
  constructor(private _formBuilder: FormBuilder,
    private _companyService: CompanyService,
    private _changeDetectorRef: ChangeDetectorRef,
    ) {
  }
  save() {
    this.selectedCompany = { ...this.companyForm.value }
    this._companyService.saveCompany(this.selectedCompany).subscribe(
      {
        next: () => {
          this._changeDetectorRef.markForCheck();

        },
        error: err => {
          alert(`Daniyal:${JSON.stringify(err)}`)
        }
      }
    );
  }
  ngOnInit(): void {
    this.company$ = this._companyService.company$;
    this.companyForm = this._formBuilder.group({
      companyId: [, Validators.required],
      name: ['', Validators.required],
      website: ['', Validators.required],
      companyOwner: [, Validators.required],
      mobile: [''],
      work: [''],
      billingAddress: [''],
      billingStreet: [''],
      billingCity: [''],
      billingZip: [''],
      billingState: [''],
      billingCountry: [''],
      deliveryAddress: [''],
      deliveryStreet: [''],
      deliveryCity: [''],
      deliveryZip: [''],
      deliveryState: [''],
      deliveryCountry: [''],
      industryId: [],
      industryTitle: [''],
      createdDate: ['']
    });
    this._companyService.company$.pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }))
      .subscribe((company: Company) => {
        this.selectedCompany = { ...company };
        this.companyForm.patchValue(company, { emitEvent: false });
        this._changeDetectorRef.markForCheck();
      });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
