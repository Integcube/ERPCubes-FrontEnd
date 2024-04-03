import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CreateChecklistService } from '../create-checklist.service';
import { Subject, takeUntil } from 'rxjs';
import { CheckPoint, Checklist, DashboardView } from '../create-checklist.type';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-checklistform',
  templateUrl: './create-checklistform.component.html',
  styleUrls: ['./create-checklistform.component.scss']
})
export class CreateChecklistformComponent implements OnInit {
  @ViewChildren('newCheckInput') newCheckInputs: QueryList<ElementRef>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  checkpointChanged: Subject<Checklist> = new Subject<Checklist>();
  private checklistSubject = new Subject<any>()
  checklist$ = this.checklistSubject.asObservable();
  checkpoints: CheckPoint[];
  showDueDaysArray: boolean[] = [];
  showIsRequiredArray: boolean[] = [];
  showPriorityArray: boolean[] = [];
  selectedChecklist: any;
  isSelected = false;
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


  constructor(
    private _checklistService: CreateChecklistService,
    private _routerr:Router
  ) { }

  ngOnInit(): void {

    this._checklistService.selectedCheckList$.subscribe(item => {
      this.checklist = item; 
    
    });

    this._checklistService.Checkpoint$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data =>{ 
    this.checklist.checkpoints =data;
    });
    if (!this.checklist.clId) {
      this.checklist.clId = -1;
    }
  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }

  setView(view: number) {
    if (view > 1) {
      this.views[this.activeView - 1].completed = true;
    }
    this.activeView = view;
    this.isLastView = view === this.views.length;

  }
  prepareChecklistData(): any {
    const filteredCheckpoints = this.checklist.checkpoints.filter(checkpoint => checkpoint.title.trim() !== '');
    const requestData = {
      checklist: {
        clId: this.checklist.clId,
        title: this.checklist.title,
        description: this.checklist.description,
        checkpoints: filteredCheckpoints.map(checkpoint => {
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
            isRequired: checkpoint.isRequired ? 1 : 0,
            cpId: checkpoint.cpId,
            isDeleted:checkpoint.isDeleted
          };
        })
      }
    };

    return requestData;
  }



  save(): void {
    const requestData = this.prepareChecklistData();
    this._checklistService.saveChecklist(requestData.checklist).subscribe();
    this._routerr.navigate(['/checklist/create']);
  }




  onNextClick() {
    if (this.activeView === this.views.length) {
      this.save();
    } else {
      this.setView(this.activeView + 1);
      this.loadCheckPoint();
    }
  }

  loadCheckPoint() {
    this._checklistService.getcheckpoint(this.checklist.clId).subscribe();
  }





  addChecklist(): void {
    this.checklist.checkpoints.push({ ...new CheckPoint({}) });

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

  removeCheckpoint(index: number,obj:CheckPoint): void {

    if(obj.cpId==-1){
      this.checklist.checkpoints.splice(index, 1);
    }else{
      this.checklist.checkpoints[index].isDeleted=1;
    }

    this.checkpointChanged.next(this.checklist);
}
}