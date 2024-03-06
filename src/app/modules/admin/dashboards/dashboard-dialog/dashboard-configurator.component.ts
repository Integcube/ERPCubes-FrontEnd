import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DashboardView } from './dashboard-configurator.type';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewDashboardDialogComponent } from '../newdashboard-dialog/newdashboard-dialog.component';

@Component({
  selector: 'dashboard-configurator',
  templateUrl: './dashboard-configurator.component.html',
  styleUrls: ['./dashboard-configurator.component.scss'],
})
export class DashboardConfiguratorComponent implements OnInit {



  isSelected = false;
  hovered = false;

  viewForm: UntypedFormGroup
  isLinear = false;
  activeView = 1;
  views: DashboardView[] = [{
    viewName: "Enter Dashboard Information",
    completed: false,
    viewId: 1,
  },
  {
    viewName: "Select Template",
    completed: false,
    viewId: 2,
  },
  ]
  constructor(private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<DashboardConfiguratorComponent>,
    private _dialog: MatDialog,


  ) { }

  ngOnInit(): void {
    debugger;
    this.viewForm = this._formBuilder.group({
      dashboardId: [, Validators.required],
      name: [, Validators.required],
      isPrivate: [, Validators.required]
    });
  }
 
  setView(view: number) {
    if (view > 1) {
        this.views[this.activeView - 1].completed = true;
    }

    this.activeView = view;
}

  closeDialog() {
    this._matDialogRef.close();
  }
  toggleSelection() {
    this.isSelected = !this.isSelected;
  }
  openTrashDialog(){
    const restoreDialogRef = this._dialog.open(NewDashboardDialogComponent,
      {
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
        // panelClass: 'dashboard-configurator',

        autoFocus: false,
        // data: {
        //   type: "LEAD",
        // }
      }
    );
    // restoreDialogRef.afterClosed().subscribe((result) => {
    //   this._dashboardService.getDashboard().pipe(takeUntil(this._unsubscribeAll)).subscribe();
    // });
  }

}