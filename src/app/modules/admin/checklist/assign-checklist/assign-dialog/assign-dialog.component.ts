import { ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject} from 'rxjs';
import { AssignChecklistService } from '../assign-checklist.service';
import { Assign, CheckListInfo, DashboardView } from '../assign-checklist.type';
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
    public matDialogRef: MatDialogRef<AssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { Data: CheckListInfo },

    private _assignChecklistService: AssignChecklistService,
    private _changeDetectorRef: ChangeDetectorRef,

  ) { }

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
    this.checkList$ = this._assignChecklistService.CheckList$
      this.viewForm = this._formBuilder.group({
     
        clId: [this._data.Data.clId, Validators.required], 
        remarks: [this._data.Data.remarks],
        execId: [this._data.Data.execId], 
        referenceno: [this._data.Data.referenceno,Validators.required], 
        userId: [this._data.Data.userId], 

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
    debugger
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
     this._assignChecklistService.getcheckpoint(this.viewForm.value.clId,this.viewForm.value.execId,this.viewForm.value.userId).subscribe();
  }
}