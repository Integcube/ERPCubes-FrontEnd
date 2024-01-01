import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Subject, takeUntil, catchError, EMPTY, filter } from 'rxjs';
import { ProjectListComponent } from '../project-list/project-list.component';
import { ProjectService } from '../project.service';
import { Project, Company } from '../project.type';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {

  @ViewChild('title') private _titleField: ElementRef;
  projects: Project[];
  projectForm: FormGroup;
  selectedProject: Project;
  companiesz: Company[]
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    private _projectListComponent: ProjectListComponent,
    private _projectService: ProjectService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }
  ngOnInit(): void {
    this._projectListComponent.matDrawer.open();
    this.projectForm = this._formBuilder.group({
      projectId: [, Validators.required],
      title: ['', Validators.required],
      companyId: [0, Validators.required],
      code: [, Validators.required],
      budget: ['', Validators.required],
      description: ['']
    });
    this._projectService.companies$.pipe(takeUntil(this._unsubscribeAll),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })).subscribe((companies) => {
      this.companiesz = [...companies];
      this._changeDetectorRef.markForCheck();
    })
    this._projectService.project$.pipe(
      takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
      )
      .subscribe(
        (project: Project) => {
          this._projectListComponent.matDrawer.open();
          this.selectedProject = { ...project };
          this.projectForm.patchValue(project, { emitEvent: false });
          this._changeDetectorRef.markForCheck();
      });
  }
  ngAfterViewInit(): void {
    this._projectListComponent.matDrawer.openedChange
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(opened => opened)
      )
      .subscribe(() => {
        this._titleField.nativeElement.focus();
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._projectListComponent.matDrawer.close();
  }
  saveProject() {
    this._projectService.saveProject(this.projectForm)
    .pipe(
      takeUntil(this._unsubscribeAll),
      catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    }))
    .subscribe((data) =>
        {
          this._changeDetectorRef.markForCheck();
          this.closeDrawer();
          this._projectListComponent.onBackdropClicked();
        }
      );
      
  }
  deleteProjectCall() {
    this.closeDrawer();
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This action cannot be undone!',
      actions: {
        confirm: {
          label: 'Delete'
        }
      }
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._projectService.deleteProject(this.selectedProject.projectId).pipe(takeUntil(this._unsubscribeAll),
          catchError(err => {
            this.errorMessageSubject.next(err);
            return EMPTY;
          })
        )
          .subscribe((isDeleted) => {
            if (!isDeleted) {
              return;
            }
          });

        this._changeDetectorRef.markForCheck();
      }
    });
  }
  onProjectCompanySelected(event: MatAutocompleteSelectedEvent): void {
    debugger;
    const selectedProjectCompany = event.option.value ;
    this.projectForm.get('companyId').patchValue(selectedProjectCompany);
    this._changeDetectorRef.markForCheck();
  }
  filterProjectCompany(val: any): Company[] {
    debugger;
    let v: string;
    if (val.name)
      v = val.name
    else
      v = val
    return this.companiesz.filter(source =>
      source.name.toLowerCase().indexOf(v?.toLowerCase()) === 0);
  }
}