import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { Dashboard, DashboardWidget } from '../../list-dashboard.type';
import { ListDashboardService } from '../../list-dashboard.service';


@Component({
  selector: 'dashboard-builder-dialog',
  templateUrl: './dashboard-builder-dialog.component.html',

})
export class DashboardBuilderDialogComponent {
  selectedDashboard:Dashboard;
  options: GridsterConfig;
  dashboard: Array<GridsterItem> =[];
  viewForm: FormGroup;
    constructor(
        private _matDialogRef: MatDialogRef<DashboardBuilderDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { dashboard: Dashboard },
        private _dashboardService: ListDashboardService
    
    ) {     this.selectedDashboard = data.dashboard;

    }
 

    dragStartHandler(ev: DragEvent, component): void {
      if (ev.dataTransfer) {
        ev.dataTransfer.dropEffect = 'copy';
        ev.dataTransfer.setData('text/plain', component);
        console.log('dragging data set', ev.dataTransfer);
      }
      console.log('dragging', { ev });
    }
  
    static itemChange(item, itemComponent) {
      console.info('itemChanged', item, itemComponent);
    }
  
    static itemResize(item, itemComponent) {
      console.info('itemResized', item, itemComponent);
    }
  
    toggleDrag() {
      this.options.draggable.enabled = !this.options.draggable.enabled;
      this.options.api.optionsChanged();
    }
  
    onDrop(ev, item: GridsterItem) {
      console.log({ item });
      console.log('dropping', { data: ev.dataTransfer });
      const componentType = ev.dataTransfer.getData('text');
      console.log({ componentType });
      this.dashboard.push({
        ...item,
        name: componentType,
      });
    }
  
    ngOnInit() {
      if (this.selectedDashboard.widgets) {
        try {
          const jsonArray = JSON.parse(this.selectedDashboard.widgets);
          const widgetObjects = jsonArray.map(widget => {
            return {
              cols: widget.cols,
              rows: widget.rows,
              y: widget.y,
              x: widget.x,
              name: widget.name
            };
          });
    
          this.dashboard = [...widgetObjects];
        } catch (error) {
          console.error('Error parsing widgets', error);
        }
      }
      this.options = {
        minCols: 3, 
        minRows:3,
        defaultItemCols: 1,
        defaultItemRows: 1,
        itemChangeCallback: DashboardBuilderDialogComponent.itemChange,
        itemResizeCallback: DashboardBuilderDialogComponent.itemResize,
        enableEmptyCellDrop: true,
        resizable: {
          enabled: true,
        },
        emptyCellDropCallback: this.onDrop.bind(this),
        pushItems: true,
        draggable: {
          enabled: true,
        },
      };
  



    }
  
    changedOptions() {
      this.options.api.optionsChanged();
    }
  
    removeItem(item) {
      this.dashboard.splice(this.dashboard.indexOf(item), 1);
    }
  
    addItem() {
      this.dashboard.push({} as any);
    }


    closeDialog() {
      this._dashboardService.getDashboard().subscribe();
      this._matDialogRef.close();
    }

    removeGridsterItem(item: any): void {
        // Find the index of the item in the dashboard array
        const index = this.dashboard.findIndex((dashboardItem) => dashboardItem === item);
    
        // Remove the item if found
        if (index !== -1) {
          this.dashboard.splice(index, 1);
        }
    }

    save() {
      // Stringify the selected charts and save them as strings in the widgets property
      const widgetStrings = JSON.stringify(this.dashboard);
    
      const dashboardId = this.data.dashboard.dashboardId;
    
      this._dashboardService.saveWidget(dashboardId, widgetStrings).subscribe({
        next: () => {
          console.log('Widgets saved successfully!');
          
          this._dashboardService.getDashboard().subscribe(() => {
            this._matDialogRef.close();
          });
        },
        error: (error) => {
          console.error('Error saving widgets', error);
        },
      });
    }
    
    
    
    
    

    
}