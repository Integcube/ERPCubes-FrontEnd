import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { EMPTY, Subject, filter, takeUntil } from 'rxjs';
import { CompanyListComponent } from '../company-list/company-list.component';
import { Company } from '../company.type';
import { CompanyService } from '../company.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';

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
  user: User;
  users$ = this._companyService.users$;
  industries$ = this._companyService.industries$;
  companyForm: FormGroup;
  editMode: boolean = false;
  selectedCompany: Company;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  

  constructor(
    private _formBuilder: FormBuilder,
    private _companyListComponent: CompanyListComponent,
    private _companyService: CompanyService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) { }

  ngOnInit(): void {
    this._companyListComponent.matDrawer.open();
    this._userService.user$.subscribe(user => {
      this.user = user;
      this._changeDetectorRef.markForCheck();
    })
    this.company$ = this._companyService.company$;
    this.companyForm = this._formBuilder.group({
      companyId: [, Validators.required],
      name: ['', Validators.required],
      website: ['', Validators.required],
      companyOwner: [this.user.id, Validators.required],
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
    this._companyService.company$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((company: Company) => {
      this._companyListComponent.matDrawer.open();
      this.selectedCompany = { ...company };
      this.companyForm.patchValue(company, { emitEvent: false });
      this._changeDetectorRef.markForCheck();
    });
  }
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._companyListComponent.matDrawer.close();
  }
  ngAfterViewInit(): void {
    this._companyListComponent.matDrawer.openedChange
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(opened => opened)
      )
      .subscribe(() => {
        this._titleField.nativeElement.focus();
      });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  save() {
    this.selectedCompany = { ...this.companyForm.value }
    this._companyService.saveCompany(this.selectedCompany).subscribe(
      {
        next: () => {
          this._companyListComponent.onBackdropClicked();
          this.closeDrawer();
          this._changeDetectorRef.markForCheck();

        }
      }
    );
  }
  delete() {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Company',
      message: 'Are you sure you want to delete this Company? This action cannot be undone!',
      actions: {
        confirm: {
          label: 'Delete'
        }
      }
    });
    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        this.selectedCompany = { ...this.companyForm.value }
        this._companyService.deleteCompany(this.selectedCompany).subscribe(
          {
            next: () => {
              this._companyListComponent.onBackdropClicked();
              this.closeDrawer();
              this._changeDetectorRef.markForCheck();
            }
          }
        );
      }
    });
  }
}
