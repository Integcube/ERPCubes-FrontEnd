import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil, catchError, EMPTY, filter } from 'rxjs';
import { LeadListComponent } from '../lead-list/lead-list.component';
import { LeadService } from '../lead.service';
import { Lead } from '../lead.type';

@Component({
  selector: 'app-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class LeadFormComponent implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('firstName') private _titleField: ElementRef;
  private leadSubject = new Subject<Lead>();
  lead$ = this.leadSubject.asObservable();
  user: User;
  users$ = this._leadService.users$;
  industries$ = this._leadService.industries$;
  leadStatus$ = this._leadService.leadStatus$;
  leadSource$ = this._leadService.leadSource$;
  product$ = this._leadService.product$;
  campaigns$ = this._leadService.campaigns$;
  leadForm: FormGroup;
  editMode: boolean = false;
  selectedlead: Lead;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  constructor(
    private _formBuilder: FormBuilder,
    private _leadListComponent: LeadListComponent,
    private _leadService: LeadService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) { }
  ngOnInit(): void {
    this._leadListComponent.matDrawer.open();
    this._userService.user$.subscribe(user => {
      this.user = user;
      this._changeDetectorRef.markForCheck();
    })
    this.lead$ = this._leadService.lead$;
    this.leadForm = this._formBuilder.group({
      leadId: [, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      leadOwner: [this.user.id, Validators.required],
      status: ['', Validators.required],
      email: [''],
      mobile: [''],
      work: [''],
      address: [''],
      street: [''],
      city: [''],
      zip: [''],
      state: [''],
      country: [''],
      sourceId: [],
      industryId: [],
      productId: [],
      campaignId: [],
      createdDate: ['']
    });
    this._leadService.lead$.pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }))
      .subscribe((lead: Lead) => {
        this._leadListComponent.matDrawer.open();
        this.selectedlead = { ...lead };
        this.leadForm.patchValue(lead, { emitEvent: false });
        this._changeDetectorRef.markForCheck();
      });
  }
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._leadListComponent.matDrawer.close();
  }
  ngAfterViewInit(): void {
    this._leadListComponent.matDrawer.openedChange
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(opened => opened)
      )
      .subscribe(() => {
        this._titleField.nativeElement.focus();
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  save() {
    this.selectedlead = { ...this.leadForm.value }
    this._leadService.saveLead(this.selectedlead).subscribe(
      {
        next: () => {
          this._leadListComponent.onBackdropClicked();
          this.closeDrawer();
          this._changeDetectorRef.markForCheck();
        },
        error: err => {
          alert(`Daniyal:${JSON.stringify(err)}`)
        }
      }
    );
  }
  delete() {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete lead',
      message: 'Are you sure you want to delete this lead? This action cannot be undone!',
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
        this.selectedlead = { ...this.leadForm.value }
        this._leadService.deleteLead(this.selectedlead).subscribe(
          {
            next: () => {
              this._leadListComponent.onBackdropClicked();
              this.closeDrawer();
              this._changeDetectorRef.markForCheck();
            },
            error: err => {
              alert(`Daniyal:${JSON.stringify(err)}`)
            }
          }
        );
      }
    });
  }

}
