import { Component, ElementRef, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CheckPoint, Checklist, DashboardView } from '../create-checklist.type';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateChecklistService } from '../create-checklist.service';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';


@Component({
  selector: 'checklist-dialog',
  templateUrl: './checklist-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ChecklistDialogComponent {
  @ViewChildren('newCheckInput') newCheckInputs: QueryList<ElementRef>;
  isSelected=false;
  checklist = new Checklist({});
  viewForm: UntypedFormGroup;
  activeView = 1;
  views: DashboardView[] = [
    {
      viewName: "Enter Checklist Information",
      completed: false,
      viewId: 1,
      icon: 'feather:check',
    },
    {
      viewName: "Select Template",
      completed: false,
      viewId: 2,
      icon: 'feather:check',
    },
    {
      viewName: "Add Checklists",
      completed: false,
      viewId: 3,
      icon: 'feather:check',
    }
  ];
  constructor(private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<ChecklistDialogComponent>,
    private _checklistService: CreateChecklistService,
  ) { }

  ngOnInit(): void {

  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
    }

  setView(view: number) {
    if (view > 1) {
      this.views[this.activeView - 1].completed = true;
    }
    this.activeView = view;
  }

  save() {
  }


  onNextClick() {
    if (this.activeView === 3) {
      this.save();
      this.closeDialog();
    } else {
      this.setView(this.activeView + 1);
    }
  }

  closeDialog() {
    this._matDialogRef.close();
  }



  addChecklist(): void {
    this.checklist.checkpoints.push({...new CheckPoint({})});
   
    setTimeout(() => {
      if (this.newCheckInputs && this.newCheckInputs.length > 0) {
        const lastInputElement = this.newCheckInputs.last.nativeElement as HTMLInputElement;
        lastInputElement.focus();
      }
    }, 10);
  }




}
