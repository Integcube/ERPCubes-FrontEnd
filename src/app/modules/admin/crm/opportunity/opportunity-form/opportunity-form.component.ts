import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil, catchError, EMPTY, filter } from 'rxjs';
import { Opportunity } from '../opportunity.types';
import { OpportunityListComponent } from '../opportunity-list/opportunity-list.component';
import { OpportunityService } from '../opportunity.service';

@Component({
  selector: 'app-opportunity-form',
  templateUrl: './opportunity-form.component.html',
  styleUrls: ['./opportunity-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunityFormComponent implements OnInit {
  @ViewChild('opportunityTitle') private _titleField: ElementRef;
  private opportunitySubject = new Subject<Opportunity>();
  opportunity$ = this.opportunitySubject.asObservable();
  user: User;
  source$ = this._opportunityService.opportunitySource$;
  opportunityForm: FormGroup;
  editMode: boolean = false;
  selectedOpportunity: Opportunity;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  constructor(
    private _formBuilder: FormBuilder,
    private _opportunityListComponent: OpportunityListComponent,
    private _opportunityService: OpportunityService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) { }
  ngOnInit(): void {
    this._opportunityListComponent.matDrawer.open();
    this._userService.user$.subscribe(user => {
      this.user = user;
      this._changeDetectorRef.markForCheck();
    })
    this.opportunity$ = this._opportunityService.opportunity$;
    this.opportunityForm = this._formBuilder.group({
      opportunityId: [, Validators.required],
      opportunityTitle: ['', Validators.required],
      opportunitySource: [null, Validators.required],
      opportunityDetail: ''
    });
    this._opportunityService.opportunity$.pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }))
      .subscribe((opportunity: Opportunity) => {
        this._opportunityListComponent.matDrawer.open();
        this.selectedOpportunity = { ...opportunity };
        this.opportunityForm.patchValue(opportunity, { emitEvent: false });
        this._changeDetectorRef.markForCheck();
      });
  }
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._opportunityListComponent.matDrawer.close();
  }
  ngAfterViewInit(): void {
    this._opportunityListComponent.matDrawer.openedChange
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
    this.selectedOpportunity = { ...this.opportunityForm.value }
    debugger;
    this._opportunityService.saveOpportunity(this.selectedOpportunity).subscribe(
      {
        next: () => {
          this._opportunityListComponent.onBackdropClicked();
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
      title: 'Delete opportunity',
      message: 'Are you sure you want to delete this opportunity? This action cannot be undone!',
      actions: {
        confirm: {
          label: 'Delete'
        }
      }
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.selectedOpportunity = { ...this.opportunityForm.value }
        this._opportunityService.deleteOpportunity(this.selectedOpportunity).subscribe(
          {
            next: () => {
              this._opportunityListComponent.onBackdropClicked();
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
