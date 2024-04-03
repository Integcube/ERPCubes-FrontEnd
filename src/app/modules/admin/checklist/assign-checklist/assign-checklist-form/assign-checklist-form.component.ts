import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AssignChecklistService } from '../assign-checklist.service';
import { Observable } from 'rxjs';
import { Assign, CheckListInfo, DashboardView } from '../assign-checklist.type';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-assign-checklist-form',
  templateUrl: './assign-checklist-form.component.html',
  styleUrls: ['./assign-checklist-form.component.scss']
})
export class AssignChecklistFormComponent implements OnInit {
  checkpoints$ = this._assignChecklistService.Checkpoint$;
  users$=this._assignChecklistService.users$
  itemId: string;
  _data:CheckListInfo;
  constructor(private _formBuilder: UntypedFormBuilder,
    private _assignChecklistService: AssignChecklistService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router :ActivatedRoute,
    private _routerr:Router
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
    this._assignChecklistService.selectedCheckList$.subscribe(item => {
    this._data = item; });

  this._router.paramMap.subscribe(params => {
    this.itemId = params.get('id');
  });


   this.checkList$ = this._assignChecklistService.CheckList$
     this.viewForm = this._formBuilder.group({
       clId: [this._data.clId, Validators.required], 
       remarks: [this._data.remarks],
       execId: [this._data.execId], 
       referenceno: [this._data.referenceno,Validators.required], 
       userId: ["-1"], 

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
     next: () => {
      this._routerr.navigate(['/checklist/assign']);
     },
     error: (error) => {
       console.error('Error saving dashboard', error);
     },
   });
 }

 onNextClick() {
   if (this.activeView === 2) {
     this.save();
   } else {
     this.setView(this.activeView + 1);
     this.loadCheckPoint();
   }
 }

 toggleSelection() {
   this.isSelected = !this.isSelected;
 }
loadCheckPoint() {
    this._assignChecklistService.getcheckpoint(this.viewForm.value.clId,this.viewForm.value.execId,this.viewForm.value.userId).subscribe();
 }

 closeDialog() {
 
}
}