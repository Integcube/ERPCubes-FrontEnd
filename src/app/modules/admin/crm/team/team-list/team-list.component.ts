import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { TeamService } from '../team.service';
import { Team } from '../team.type';
import { EMPTY, Observable, Subject, catchError, filter, fromEvent, takeUntil } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatDrawer } from '@angular/material/sidenav';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector        : 'app-team-list',
  templateUrl     : './team-list.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class TeamListComponent implements OnInit  {
  
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Team>;
  displayedColumns: string[] = ['select', 'teamName', 'teamLeaderName', 'teamMembersName'];
  selection = new SelectionModel<Team>(true, []);

  teams$: Observable<Team[]>;
  teams: Team[];
  teamCount: number = 0;
  selectedTeam: Team;

  drawerMode: 'side' | 'over';
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _teamService: TeamService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
  ) { }

  ngOnInit(): void {
    //Get team List
    this.teams$ = this._teamService.teams$;
    this._teamService.teams$
      .pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }))
      .subscribe((team: Team[]) => {
        this.teams = [...team];
        
        this.teamCount = this.teams.length;
        this.dataSource = new MatTableDataSource(this.teams);
        this._changeDetectorRef.markForCheck();
      });
    // Get selected team
    this._teamService.team$
      .pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }))
      .subscribe((team: Team) => {
        this.selectedTeam = team;
        this._changeDetectorRef.markForCheck();
      });
    // Subscribe to MatDrawer opened change
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        this.selectedTeam = null;
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
        this.createTeam();
      });
  }
  

  onMouseEnter(row: Team){
    row.isHovered=true;
  }

  onMouseLeave(row: Team){
    row.isHovered=false;
  }

  previewTeam(row: Team) {
    this._router.navigate(['detail-view', row.teamId], { relativeTo: this._activatedRoute });
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

  createTeam() {
    let newTeam:Team = new Team({});
    this._teamService.selectedTeam(newTeam);
    this._router.navigate(['./', newTeam.teamId], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }

  updateTeam(selectedTeam:Team){
    this._teamService.selectedTeam(selectedTeam);
    this._router.navigate(['./', selectedTeam.teamId], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }

  deleteRestoreTeam(){
    this._teamService.getTeams().subscribe();
    //this._changeDetectorRef.markForCheck();
  }

  onBackdropClicked(): void {
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
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
  checkboxLabel(row?: Team): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.teamId + 1}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  /**
 * Track by function for ngFor loops
 *
 * @param index
 * @param item
 */
trackByFn(index: number, item: any): any
{
    return item.id || index;
}
}