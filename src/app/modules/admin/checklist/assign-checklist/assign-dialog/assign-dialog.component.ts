import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject} from 'rxjs';
import { AssignChecklistService } from '../assign-checklist.service';
import { Assign, DashboardView } from '../assign-checklist.type';
@Component({
  selector: 'assign-dialog',
  templateUrl: './assign-dialog.component.html',
  styleUrls: ['./assign-dialog.component.scss'],

})
export class AssignDialogComponent implements OnInit {
 checkpoints$ = this._assignChecklistService.Checkpoint$;
 users$=this._assignChecklistService.users$

  constructor(private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<AssignDialogComponent>,
    private _assignChecklistService: AssignChecklistService,
    private _changeDetectorRef: ChangeDetectorRef,

  ) { }

  // private dashboardSubject = new Subject<any>()
 
  isSelected = false;
  hovered = false;

  checkList$: Observable<any[]>;
  checkpoints: Assign[];
  viewForm: UntypedFormGroup
  isLinear = false;
  activeView = 1;
  views: DashboardView[] = [{
    viewName: "CheckList Information",
    completed: false,
    viewId: 1,
    icon: 'feather:check',
  },
  {
    viewName: "Assign CheckPoint",
    completed: false,
    viewId: 2,
    icon: 'feather:check',

  }
  ]
  
  ngOnInit(): void {
    this._assignChecklistService.getUsers().subscribe();
    this.checkList$ = this._assignChecklistService.CheckList$
      this.viewForm = this._formBuilder.group({
        clId: [-1, Validators.required], 
        remarks: [''],
        execId: [-1, Validators.required], 
      });
      this.checkpoints$.subscribe((chk: Assign[]) => {
        this.checkpoints = [...chk];
        this._changeDetectorRef.markForCheck();
      });
  }

  
  setView(view: number) {
    if (view > 1) {
      this.views[this.activeView - 1].completed = true;
    }
    this.activeView = view;
  }
  save() {
    this._assignChecklistService.assignCheckPoint(this.viewForm.value,this.checkpoints).subscribe({
      next: () => {},
      error: (error) => {
        console.error('Error saving dashboard', error);
      },
    });
  }

  onNextClick() {
    if (this.activeView === 2) {
      this.save();
      this.closeDialog();
    } else {
      this.setView(this.activeView + 1);
      this.loadCheckPoint();
    }
  }
  closeDialog() {
    this._matDialogRef.close();
  }
  toggleSelection() {
    this.isSelected = !this.isSelected;
  }
 loadCheckPoint() {
     this._assignChecklistService.getcheckpoint(this.viewForm.value.clId,this.viewForm.value.execId).subscribe();
  }
}