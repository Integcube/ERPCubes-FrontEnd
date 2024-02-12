import { SelectionModel } from '@angular/cdk/collections';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Observable, Subject, takeUntil, fromEvent, filter } from 'rxjs';
import { UserForm } from '../user.type';
import { UserFormService } from '../user.service';
import { DeletedUsers } from '../../trash/trash.type';
import { UserTrashComponent } from '../../trash/user-trash/user-trash.component';
import { cloneDeep } from 'lodash';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<UserForm>;
  displayedColumns: string[] = ['select',  'firstName', 'lastName', 'userName', 'email', 'phoneNumber'];
  selection = new SelectionModel<UserForm>(true, []);

  users$: Observable<UserForm[]>;
  users: UserForm[];
  userCount: number = 0;
  selectedUser: UserForm;
  drawerMode: 'side' | 'over';
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  


  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _dialog: MatDialog,

    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _userFormService: UserFormService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
  ) { }

  ngOnInit(): void {
    //Get user List
    this.users$ = this._userFormService.users$;
    this._userFormService.users$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((users: UserForm[]) => {
        this.users = [...users];
        this.userCount = users.length;
        this.dataSource = new MatTableDataSource(this.users);
        this.ngAfterViewInit();
        this._changeDetectorRef.markForCheck();
      });
    // Get selected company
    this._userFormService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: UserForm) => {
        this.selectedUser = user;
        this._changeDetectorRef.markForCheck();
      });
    // Subscribe to MatDrawer opened change
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        this.selectedUser = null;
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
        this.createUser();
      });
  }


  onMouseEnter(row: UserForm){
    row.isHovered=true;
  }

  onMouseLeave(row: UserForm){
    row.isHovered=false;
  }

  previewUser(row: UserForm) {
    this._router.navigate(['detail-view', row.id], { relativeTo: this._activatedRoute });
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
  createUser() {
    
    let newUser:UserForm = new UserForm({});
    
    this._userFormService.selectedUser(newUser);
    
    this._router.navigate(['./', newUser.id], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  updateUser(selectedUser:UserForm){
    
    this._userFormService.selectedUser(selectedUser);
    
    this._router.navigate(['./', selectedUser.id], { relativeTo: this._activatedRoute });
    
    this._changeDetectorRef.markForCheck();
  }
  
  onBackdropClicked(): void {
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });
    this._changeDetectorRef .markForCheck();
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: UserForm): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openTrashDialog() {
    let trash = new DeletedUsers({})
    const restoreDialogRef = this._dialog.open(UserTrashComponent,
      {
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "100%",

        autoFocus: false,
      data     : {
          trash: cloneDeep(trash)
      }
      }
    );
  }

}
