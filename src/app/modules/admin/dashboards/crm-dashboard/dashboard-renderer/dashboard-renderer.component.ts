import { Component, Input } from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { Dashboard } from "../crm-dashboard.type";

@Component({
    selector: 'app-dashboard-renderer',
    templateUrl: './dashboard-renderer.component.html',
  })
  export class DashboardRendererComponent {
    @Input() widgets: string | undefined;
    dashboard: Array<GridsterItem> =[];
    options: GridsterConfig;
    ngOnInit(){
        this.options = {
            minCols: 3,
            minRows: 3,
            defaultItemCols: 1,
            defaultItemRows: 1,
            enableEmptyCellDrop: false, 
            resizable: {
              enabled: false, 
            },
            emptyCellDropCallback: null,
            pushItems: false, 
            draggable: {
              enabled: false, 
            },
          };
          if (this.widgets) {
            try {
              const jsonArray = JSON.parse(this.widgets);
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
    }
  }