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
import { Observable,debounceTime, Subject, takeUntil,merge,switchMap,map,  fromEvent, filter } from 'rxjs';
import { UserForm } from '../user.type';
import { UserFormService } from '../user.service';
import { MatDialog } from '@angular/material/dialog';
import { TrashComponent } from '../../trash/trash.component';
import { Pagination, PaginationView } from 'app/core/user/user.types';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) _paginator: MatPaginator;
  @ViewChild(MatSort) _sort: MatSort;

  dataSource: MatTableDataSource<UserForm>;
  displayedColumns: string[] = ['select',  'firstName', 'lastName', 'userName', 'email', 'phoneNumber'];
  selection = new SelectionModel<UserForm>(true, []);
  pagination: Pagination;
  paginationparm= new PaginationView({});
  users$: Observable<UserForm[]>;
  users: UserForm[];
  userCount: number = 0;
  selectedUser: UserForm;
  drawerMode: 'side' | 'over';
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  isLoading: boolean = false;


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
    this.users$ = this._userFormService.users$;
    this._userFormService.users$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((users: UserForm[]) => {
        this.users = [...users];
        this.userCount = users.length;
        this.dataSource = new MatTableDataSource(this.users);
        // this.dataSource.paginator = this._paginator;
        // this.dataSource.sort = this._sort;
        this._changeDetectorRef.markForCheck();
      });


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

      this._userFormService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: Pagination) => {
          this.pagination = pagination;
          this._changeDetectorRef.markForCheck();
      });
        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(1000),
                switchMap((query) => {

                  this._userFormService.updatePaginationParam(this.paginationparm);
                    this.isLoading = true;
                    return this._userFormService.getUsers();
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
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


    if ( this._sort && this._paginator )
    {
debugger
this._sort.sort({
  id          : 'firstName',
  start       : 'asc',
  disableClear: true
});

// Mark for check
this._changeDetectorRef.markForCheck();

// If the user changes the sort order...
this._sort.sortChange
  .pipe(takeUntil(this._unsubscribeAll))
  .subscribe(() => {
      // Reset back to the first page
      this._paginator.pageIndex = 0;
  });



    merge(this._sort.sortChange, this._paginator.page).pipe(
      switchMap(() => {
        debugger
      this.paginationparm.pageIndex=this._paginator.pageIndex;
      this.paginationparm.pageSize=this._paginator.pageSize;
      this.paginationparm.active=this._sort.active;
      this.paginationparm.direction=this._sort.direction
      this._userFormService.updatePaginationParam(this.paginationparm);
        this.isLoading = true;
        return this._userFormService.getUsers();
      }),
      map(() => {
        this.isLoading = false;
      })
    ).subscribe();
    }

    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
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
    const restoreDialogRef = this._dialog.open(TrashComponent,
      {
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "100%",

        autoFocus: false,
      data     : {
          type:"USER" 
      }
      }
    );
    restoreDialogRef.afterClosed().subscribe((result) => {
      this._userFormService.getUsers().pipe(takeUntil(this._unsubscribeAll)).subscribe();
    });
  }

}
