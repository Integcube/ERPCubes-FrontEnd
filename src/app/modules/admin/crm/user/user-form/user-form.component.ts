import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil, catchError, EMPTY, filter } from 'rxjs';
import { UserForm } from '../user.type';
import { UserListComponent } from '../user-list/user-list.component';
import { UserFormService } from '../user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  @ViewChild('name') private _titleField: ElementRef;
  private userSubject = new Subject<UserForm>();
  user$ = this.userSubject.asObservable();
  userForm: FormGroup;
  editMode: boolean = false;
  selectedUser: UserForm;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  constructor(
    private _formBuilder: FormBuilder,
    private _userListComponent: UserListComponent,
    private _userFormService: UserFormService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this._userListComponent.matDrawer.open();

  this._userFormService.user$
    .pipe(
      takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )
    .subscribe((user: UserForm) => {
      this._userListComponent.matDrawer.open();
      this.selectedUser = { ...user };

      // Move the creation of userForm inside the subscription
      this.userForm = this._formBuilder.group({
        firstName: [this.selectedUser.firstName],
        lastName: [this.selectedUser.lastName],
        userName: [this.selectedUser.userName],
        email: [this.selectedUser.email],
        phoneNumber: [this.selectedUser.phoneNumber],
      });

      this._changeDetectorRef.markForCheck();
    });

  }
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._userListComponent.matDrawer.close();
  }
  ngAfterViewInit(): void {
    // Listen for matDrawer opened change
    this._userListComponent.matDrawer.openedChange
    .pipe(
      takeUntil(this._unsubscribeAll),
      filter(opened => opened)
    )
    .subscribe(() => {
      // Check if _titleField is defined before accessing it
      if (this._titleField) {
        // Focus on the title element
        this._titleField.nativeElement.focus();
      }
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  save() {
    
    this.closeDrawer();
    
    if(this.selectedUser.id==-1){
      this._userFormService.saveUser(this.selectedUser.id, this.userForm).subscribe();
    }
    else{
      this._userFormService.updateUser(this.selectedUser.id, this.userForm).subscribe();
    }
    
  }
  delete() {
    this.closeDrawer();

  }

}
