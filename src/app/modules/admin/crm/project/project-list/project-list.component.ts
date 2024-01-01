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
import { Subject, combineLatest, map, takeUntil, catchError, EMPTY, fromEvent, filter } from 'rxjs';
import { ProjectService } from '../project.service';
import { Project } from '../project.type';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Project>;
  displayedColumns: string[] = ['Title', 'Company', 'Budget', 'Description'];
  selection = new SelectionModel<Project>(true, []);

  projects: Project[];
  projectCount: number = 0;
  selectedProject: Project;

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
    private _projectService: ProjectService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
  ) { }
  companyNames$ = this._projectService.companies$
  projects$ = this._projectService.projects$
  projectWithCompanies$ = combineLatest(
    this.companyNames$,
    this.projects$,
  ).pipe(
    map(([companies, projects]) => projects.map(r => ({
      ...r,
      companyName: companies.find(a => a.companyId === r.companyId)?.name,
    } as Project))))

  ngOnInit(): void {
    //Get project List
    this.projectWithCompanies$
      .pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }))
      .subscribe((projects: Project[]) => {
        this.projects = [...projects];
        this.projectCount = this.projects.length;
        this.dataSource = new MatTableDataSource(this.projects);
        console.log(this.dataSource)
        this._changeDetectorRef.markForCheck();
      });
    // Get selected project
    this._projectService.project$
      .pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }))
      .subscribe((project: Project) => {
        this.selectedProject = project;
        this._changeDetectorRef.markForCheck();
      });
    // Subscribe to MatDrawer opened change
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        this.selectedProject = null;
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
        this.createProject();
      });
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
  createProject() {
    let newProject:Project = new Project({});
    this._projectService.selectedProject(newProject);
    this._router.navigate(['./', newProject.projectId], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  updateProject(selectedProject:Project){
    this._projectService.selectedProject(selectedProject);
    this._router.navigate(['./', selectedProject.projectId], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  deleteRestoreProject(){
    this._projectService.deleteProject(this.selectedProject.projectId).subscribe();
    //this._changeDetectorRef.markForCheck();
  }
  onBackdropClicked(): void {
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onMouseEnter(row: Project){
    row.isHovered=true;
  }
  onMouseLeave(row: Project){
    row.isHovered=false;
  }
  // previewProject(row: Project) {
  //   this._router.navigate(['detail-view', row.projectId], { relativeTo: this._activatedRoute });
  // }
}
