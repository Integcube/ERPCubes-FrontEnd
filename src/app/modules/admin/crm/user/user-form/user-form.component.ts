import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild,Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil, catchError, EMPTY, filter } from 'rxjs';
import { UserForm } from '../user.type';
import { UserListComponent } from '../user-list/user-list.component';
import { UserFormService } from '../user.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  @ViewChild('name') private _titleField: ElementRef;
  @ViewChild('firstName') firstNameInput: ElementRef;
  private userSubject = new Subject<UserForm>();
  user$ = this.userSubject.asObservable();
  userForm: FormGroup;
  editMode: boolean = false;
  selectedUser: UserForm;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  

  constructor(
    private _formBuilder: FormBuilder,
    private _userListComponent: UserListComponent,
    private _userFormService: UserFormService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private _Renderer2:Renderer2,

  ) { }
 
  ngOnInit(): void {
    this._userListComponent.matDrawer.open();

    this._userFormService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((user: UserForm) => {
      this._userListComponent.matDrawer.open();
      this.selectedUser = { ...user };

      // Move the creation of userForm inside the subscription
      this.userForm = this._formBuilder.group({
        firstName: [this.selectedUser.firstName,Validators.required],
        lastName: [this.selectedUser.lastName,Validators.required],
        userName: [this.selectedUser.userName,Validators.required],
        email: [this.selectedUser.email, Validators.required],
        phoneNumber: [this.selectedUser.phoneNumber],
        password: [this.selectedUser.password],
        id: [this.selectedUser.id],
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

    this.focusOnFirstName();
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  save() {
    if (this.selectedUser.id === -1) {
      if(!this.userForm.invalid && this.userForm.get('password').value){
        this._userFormService.saveUser(this.selectedUser.id, this.userForm).subscribe(
          () => {
            this.closeDrawer();
            this._userFormService.getUsers().subscribe( );
            this.userForm.reset();
          },
          (error) => {
            this.showSnackBarError(error);
         
          }
        );
      }
    } else {
      this._userFormService.updateUser(this.selectedUser.id, this.userForm).subscribe(
        () => {
          this.closeDrawer();
          this._userFormService.getUsers().subscribe( );
          this.userForm.reset();
        },
        (error) => {
          this.showSnackBarError(error);
        }
      );
    }
  }
  
  delete() {
    this.closeDrawer();

  }
  submitOnEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.save();
    }
  }

  private showSnackBarError(error: any): void {
    const errorMessage = error.error ? JSON.stringify(error.error) : 'An error occurred';
    const config: MatSnackBarConfig = {
      duration: 7000,
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'], 
    };
    this._snackBar.open(errorMessage, 'Close', config);
  }
  focusOnFirstName() {
    if (this.firstNameInput && this.firstNameInput.nativeElement) {
      // Use Renderer2 to focus on the input element
      this._Renderer2.selectRootElement(this.firstNameInput.nativeElement).focus();
    }
  }
}
