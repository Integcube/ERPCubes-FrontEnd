import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { EMPTY, Observable, Subject, catchError, filter, map, startWith, takeUntil } from 'rxjs';
import { TeamListComponent } from '../team-list/team-list.component';
import { Team } from '../team.type';
import { TeamService } from '../team.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { User } from 'app/core/user/user.types';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamFormComponent implements OnInit {
  @ViewChild('teamName') private _titleField: ElementRef;
  @ViewChild('teamMembersPanelOrigin') private _teamMembersPanelOrigin: ElementRef;
  @ViewChild('teamMembersPanel') private _teamMembersPanel: TemplateRef<any>;
  teams: Team[];
  teamForm: FormGroup;
  selectedTeam: Team;
  employees: User[];
  teamLeaders$: Observable<User[]>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private _teamMembersPanelOverlayRef: OverlayRef;
  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    private _teamListComponent: TeamListComponent,
    private _teamService: TeamService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this._teamListComponent.matDrawer.open();
    this.teamForm = this._formBuilder.group({
      teamId: [, Validators.required],
      teamName: ["", Validators.required],
      teamLeaderId: ["", Validators.required],
      teamLeaderName: [""],
      teamMembersId: [[]],
      teamMembersName: [[]],
    });
    
    this._teamService.employees$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((employees) => {
        this.employees = employees;
        this._changeDetectorRef.markForCheck();
    })
    
    this._teamService.team$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(
      (team: Team) => {
        this._teamListComponent.matDrawer.open();
        this.selectedTeam = { ...team };
        const teamMembersId = team.teamMembersId ? team.teamMembersId.split(',') : [];
        const teamMembersName = team.teamMembersName ? team.teamMembersName.split(',') : [];
        this.teamForm.patchValue({ ...team, teamMembersId, teamMembersName }, { emitEvent: true });
        this._changeDetectorRef.markForCheck();
    });
    this.teamLeaders$ = this.teamForm.get("teamLeaderName").valueChanges
    .pipe(
      startWith(''),
      map(val => this.filterTeamLeader(val))
    )
  }

  ngAfterViewInit(): void {
    this._teamListComponent.matDrawer.openedChange
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

  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._teamListComponent.matDrawer.close();
  }

  saveTeam() {
    this._teamService.saveTeam(this.teamForm.value)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data => {
      this.closeDrawer();
      this._teamListComponent.onBackdropClicked();
      this._changeDetectorRef.markForCheck();
    });
  }

  deleteTeamCall() {
    this.closeDrawer();
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Team',
      message: 'Are you sure you want to delete this team? This action cannot be undone!',
      actions: {
        confirm: {
          label: 'Delete'
        }
      }
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._teamService.deleteTeam(this.selectedTeam).pipe(takeUntil(this._unsubscribeAll),
          
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

  onTeamLeaderSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedTeamLeader: User = event.option.value as User;
    this.teamForm.get('teamLeaderName').patchValue(selectedTeamLeader.name);
    this.teamForm.get('teamLeaderId').patchValue(selectedTeamLeader.id);
    this._changeDetectorRef.markForCheck();
  }

  filterTeamLeader(val: any): User[] {
    let v: string;
    if (val.name)
      v = val.name
    else
      v = val
    return this.employees.filter(emp =>
      emp.name.toLowerCase().indexOf(v?.toLowerCase()) === 0);
  }

  toggleTeamMembersSelection(emplyee: User) {
    let ids: string[] = this.teamForm.value.teamMembersId;
    let names: string[] = this.teamForm.value.teamMembersName;
    const leadOwnerIndex = ids.findIndex(userId => userId === emplyee.id);
    if (leadOwnerIndex === -1) {
      ids.push(emplyee.id);
      names.push(emplyee.name);
      this.teamForm.get("teamMembersId").patchValue(ids);
      this.teamForm.get("teamMembersName").patchValue(names);
    } else {
      ids.splice(leadOwnerIndex, 1);
      names.splice(leadOwnerIndex, 1);
      this.teamForm.get("teamMembersId").patchValue(ids);
      this.teamForm.get("teamMembersName").patchValue(names);
    }
    this._changeDetectorRef.markForCheck();
  }

  openTeamMembersPanel() {
    this._teamMembersPanelOverlayRef = this._overlay.create({
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this._teamMembersPanelOrigin.nativeElement)
        .withFlexibleDimensions(true)
        .withViewportMargin(64)
        .withLockedPosition(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top'
          }
        ])
    });
    this._teamMembersPanelOverlayRef.attachments().subscribe(() => {
      this._teamMembersPanelOverlayRef.overlayElement.querySelector('input').focus();
    });
    const templatePortal = new TemplatePortal(this._teamMembersPanel, this._viewContainerRef);
    this._teamMembersPanelOverlayRef.attach(templatePortal);
    this._teamMembersPanelOverlayRef.backdropClick().subscribe(() => {
      if (this._teamMembersPanelOverlayRef && this._teamMembersPanelOverlayRef.hasAttached()) {
        this._teamMembersPanelOverlayRef.detach();

        // Reset the teamMembers filter
        // this.filteredTeamMembers = this.selectedTeamMembers;
      }

      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
