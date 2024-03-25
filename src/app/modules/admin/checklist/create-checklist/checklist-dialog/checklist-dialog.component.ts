import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {  CheckPoint, Checklist, DashboardView } from '../create-checklist.type';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateChecklistService } from '../create-checklist.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';


@Component({
  selector: 'checklist-dialog',
  templateUrl: './checklist-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChecklistDialogComponent {
    
    selectedChecklist: any;
    checkpoint=new CheckPoint({});
    checks = new Checklist({});

    private checklistSubject = new Subject<Checklist>();
    checklist$ = this.checklistSubject.asObservable();
    isSelected = false;
    hovered = false;
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
    newCheckText: string = '';
  
    constructor(private _formBuilder: UntypedFormBuilder,
        private _matDialogRef: MatDialogRef<ChecklistDialogComponent>,
        private _checklistService: CreateChecklistService,

        ) { }
  
        ngOnInit(): void {
            this.checks = new Checklist({});
         
            this.viewForm = this._formBuilder.group({
                cLId: [-1, Validators.required],
                title: ['', Validators.required],
                description: ['']
            });
        }
        
        
  
    setView(view: number) {
      if (view > 1) {
        this.views[this.activeView - 1].completed = true;
      }
      this.activeView = view;
    }
  
    save() {
        this.selectedChecklist = { ...this.viewForm.value };
        // Assuming you have a property named 'checkpoints' in your selectedChecklist object
        // this.selectedChecklist.checkpoints = this.checklists;
        
        this._checklistService.saveChecklist(this.selectedChecklist).subscribe({
          next: () => {},
          error: (error) => {
            console.error('Error saving dashboard', error);
          },
        });
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
  
    toggleSelection() {
      this.isSelected = !this.isSelected;
    }
  
    addChecklist(): void {

    this.checks.checkpoints.push(new CheckPoint({}));
    // this.checklists = this.checks.checkpoints; // Update checklists array after adding a new checklist
}

    
    
  
  //   addChecklist(): void {
  //     if (!this.checks.checkPoints) {
  //       this.checks.checkPoints = [];
  //     }
  //   }
  
    // addCheckToList(checkText: string): void {
    //     debugger;
    //   if (checkText.trim() === '') {
    //     return;
    //   }
  
    //   const newCheckPoint: CheckPoints = {
    //     cLPId: -1,
    //     description: checkText,
    //     cLId: this.checks.cLId, 
    //   };
  
    //   this.checks.checkpoints.push(newCheckPoint);
    // }
    
}
