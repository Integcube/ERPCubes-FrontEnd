import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject} from 'rxjs';
import { ListDashboardService } from '../../list-dashboard.service';
import { Dashboard, DashboardView } from '../../list-dashboard.type';

@Component({
  selector: 'dashboard-configurator',
  templateUrl: './dashboard-configurator.component.html',
  styleUrls: ['./dashboard-configurator.component.scss'],

})
export class DashboardConfiguratorComponent implements OnInit {
  constructor(private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<DashboardConfiguratorComponent>,
    private _dashboardService: ListDashboardService,



  ) { }

  private dashboardSubject = new Subject<Dashboard>()
  dashboard$ = this.dashboardSubject.asObservable();
  isSelected = false;
  hovered = false;
  selectedDashboard: any; 

  viewForm: UntypedFormGroup
  isLinear = false;
  activeView = 1;
  views: DashboardView[] = [{
    viewName: "Enter Dashboard Information",
    completed: false,
    viewId: 1,
    icon: 'feather:check',
  },
  {
    viewName: "Select Template",
    completed: false,
    viewId: 2,
    icon: 'feather:check',

  }
  ]


  ngOnInit(): void {


      this.viewForm = this._formBuilder.group({
        dashboardId: [-1, Validators.required], 
        name: ['', Validators.required],
        status: ['Active'],
        isPrivate: [null, Validators.required] 
      });


  }
  

  setView(view: number) {
    if (view > 1) {
      this.views[this.activeView - 1].completed = true;
    }
    this.activeView = view;
  }

  save() {
    this.selectedDashboard = { ...this.viewForm.value };

    this._dashboardService.saveDashboard(this.selectedDashboard).subscribe({
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
    }
  }
  

  // onNextClick() {
  //   if (this.activeView === 2) {
  //     this.save();
  //   } else {
  //     this.setView(this.activeView + 1);
  //   }
  // }

  closeDialog() {
    this._matDialogRef.close();
  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }


}