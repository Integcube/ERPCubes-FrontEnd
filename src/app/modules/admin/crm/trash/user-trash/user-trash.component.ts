import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subject, combineLatest, debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { TrashService } from '../trash.service';
import { DeletedUsers } from '../trash.type';
import { UserForm } from '../../user/user.type';
import { UserFormService } from '../../user/user.service';


@Component({
  selector: 'app-user-trash',
  templateUrl: './user-trash.component.html',
  styleUrls: ['./user-trash.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTrashComponent implements OnInit {
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  dataSource: MatTableDataSource<DeletedUsers>;
  dataSourceLead: MatTableDataSource<UserForm>;

  selection = new SelectionModel<DeletedUsers>(true, []);
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  users: DeletedUsers[];
  deletedUsers: string[] = [];

  allUsers: UserForm[];
  // displayedColumns: string[] = ['Product Name', 'Restore', 'Created By'];
  deletedUsers$: Observable<DeletedUsers[]>;
  constructor(
    private _userService: TrashService,
    private _allUserService: UserFormService,

    private _matDialogRef: MatDialogRef<UserTrashComponent>,
    private _userAllService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  getDeletedFilters(): void {
    this._userService.getDeletedUsersList().subscribe((users: DeletedUsers[]) => {
      this.deletedUsers = Array.from(new Set(users.map(user => user.deletedBy)));
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnInit(): void {
    this.deletedUsers$ = this._userService.getDeletedUsersList();
    this.getDeletedFilters();
    this._userService.deletedTrashUsers$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((users: DeletedUsers[]) => {
        this.users = [...users];
        this.dataSource = new MatTableDataSource(this.users);
        this._changeDetectorRef.markForCheck();
      });

    this.searchInputControl.valueChanges
      .pipe(
        debounceTime(300), // Adjust debounce time as needed
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(searchTerm => {
        this.deletedUsers$ = this._userService.getDeletedUsersList().pipe(
          map(leads => leads.filter(lead =>
            lead.userName.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        );

        this._changeDetectorRef.markForCheck();
      });
  }

  restoreUser(user: DeletedUsers): void {
    this._userService.restoreUser(user).subscribe(() => {
      this.deletedUsers$ = this._userService.getDeletedUsersList();
      this._changeDetectorRef.markForCheck();
    });
  }


  restoreBulkUsers(): void {
    if (this.isAnyUserSelected()) {
      const selectedLeadIds = this.selectedUsers.map(user => user.id);

      this._userService.restoreBulkUsers(selectedLeadIds).subscribe(() => {
        this.deletedUsers$ = this._userService.getDeletedUsersList();

        this._userService.getDeletedUsersList().subscribe((users: DeletedUsers[]) => {
          this.dataSource.data = users;
          this.selectedUsers = [];
          this._changeDetectorRef.markForCheck();
        });
      });

    }
  }



  selectedUsers: DeletedUsers[] = [];

  toggleSelection(event: MatCheckboxChange, user: DeletedUsers): void {
    if (event.checked) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers = this.selectedUsers.filter(selectedUser => selectedUser !== user);
    }
  }



  isAnyUserSelected(): boolean {
    return this.selectedUsers.length > 0;
  }



  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  closeDialog() {
    this._matDialogRef.close();

    this._allUserService.getUsers().subscribe((allUsers: UserForm[]) => {
      this.allUsers = [...allUsers];
      this.dataSourceLead = new MatTableDataSource(this.allUsers);
      this._changeDetectorRef.markForCheck();
    });
  }



  filterByUser(user: string): void {
    if (user === 'All Users') {
      this.deletedUsers$ = this._userService.getDeletedUsersList();
    } else {
      this.deletedUsers$ = this._userService.getDeletedUsersList().pipe(
        map(users => users.filter(lead => lead.deletedBy === user))
      );
    }
    this._changeDetectorRef.markForCheck();
  }

}