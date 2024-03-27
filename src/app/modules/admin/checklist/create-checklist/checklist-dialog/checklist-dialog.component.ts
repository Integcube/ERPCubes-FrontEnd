import { ChangeDetectorRef, Component, ElementRef, Inject, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CheckPoint, Checklist, DashboardView } from '../create-checklist.type';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateChecklistService } from '../create-checklist.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';


@Component({
  selector: 'checklist-dialog',
  templateUrl: './checklist-dialog.component.html',
  styleUrls: ['./checklist-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChecklistDialogComponent {
  @ViewChildren('newCheckInput') newCheckInputs: QueryList<ElementRef>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  checkpointChanged: Subject<Checklist> = new Subject<Checklist>();
  private checklistSubject = new Subject<any>()
  checklist$ = this.checklistSubject.asObservable();  
  // checkpoints$ = this._checklistService.Checkpoint$;
  checkpoints: CheckPoint[];

  showDueDaysArray: boolean[] = [];
  showIsRequiredArray: boolean[] = [];
  showPriorityArray: boolean[] = [];
  selectedChecklist: any;
  isSelected=false;
  checklist = new Checklist({});
  viewForm: UntypedFormGroup;
  activeView = 1;
  isLastView: boolean = false;
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
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { checklist: Checklist },

  ) { }

  ngOnInit(): void {
    // this.checklist$ = this._checklistService.checklists$
    // debugger;
    // this.checklist= this._data.checklist;
    // this._checklistService.Checkpoint$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data =>{ 
    //   debugger
    //   this.checklist.checkpoints =data;
    
    
    // });

  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
    }

  setView(view: number) {
    if (view > 1) {
      this.views[this.activeView - 1].completed = true;
    }
    this.activeView = view;
    this.isLastView = view === this.views.length; // Check if it's the last view

  }
  prepareChecklistData(): any {
    // Filter out empty checkpoints
    const filteredCheckpoints = this.checklist.checkpoints.filter(checkpoint => checkpoint.title.trim() !== '');
  
    // Prepare the checklist data
    const requestData = {
      checklist: {
        cLId: this.checklist.clId !== undefined ? this.checklist.clId : -1,
        title: this.checklist.title,
        description: this.checklist.description,
        checkpoints: filteredCheckpoints.map(checkpoint => {
          // Check if priority is defined, if not set it to -1
          if (checkpoint.priority === undefined) {
            checkpoint.priority = -1;
          }
          if (checkpoint.dueDays === null) {
            checkpoint.dueDays = -1;
          }
          return {
            title: checkpoint.title,
            dueDays: checkpoint.dueDays,
            priority: checkpoint.priority,
            isRequired: checkpoint.isRequired ? 1 : 0
          };
        })
      }
    };
  
    return requestData;
  }
  
  
  
  save(): void {
    const requestData = this.prepareChecklistData();
  
    // Assuming your service method is named saveChecklist and it accepts a Checklist object
    this._checklistService.saveChecklist(requestData.checklist)
      .subscribe(response => {
        // Handle response from the backend
      }, error => {
        // Handle error
      });
  }
  
  


  onNextClick() {
    if (this.activeView === this.views.length) {
      this.save();
      this.closeDialog();
    } else {
      this.setView(this.activeView + 2);
      this.loadCheckPoint();
    }
  }

  loadCheckPoint() {
    debugger;
    this._checklistService.getcheckpoint(this.checklist.clId).subscribe();
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

  togglePriority(priorityId: number, index: number) {
    this.checklist.checkpoints[index].priority = priorityId;
  }
  
  showFields(index: number): void {
    this.showDueDaysArray[index] = true;
    this.showIsRequiredArray[index] = true;
    this.showPriorityArray[index] = true;
  }

  showDueDays(index: number): boolean {
    return !!this.showDueDaysArray[index];
  }

  showIsRequired(index: number): boolean {
    return !!this.showIsRequiredArray[index];
  }

  showPriority(index: number): boolean {
    return !!this.showPriorityArray[index];
  }

  removeCheckpoint(checkpoint: CheckPoint): void {
    // Remove the task
    this.checklist.checkpoints = this.checklist.checkpoints.filter(item => item.title !== checkpoint.title);

    this.checkpointChanged.next(this.checklist);
  }

  }
