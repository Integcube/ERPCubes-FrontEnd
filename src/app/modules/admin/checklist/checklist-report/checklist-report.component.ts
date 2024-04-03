import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { ChecklistReporttService } from './checklist-report.service';

@Component({
  selector: 'checklist-report',
  templateUrl: './checklist-report.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChecklistReportComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('exporter') public exporter;

  dataSource: MatTableDataSource<LeadSourceReport>;
  displayedColumns: string[] = [ 'source', 'totalLeads', 'convertedLeads', 'conversionRate', 'averageDealSize', 'totalRevenue'];
  leadSourceReportCount: number = 0;
  totalLeadSource: number = 0;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  

  _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _leadSourceReportService: ChecklistReporttService,
    private _changeDetectorRef: ChangeDetectorRef,
    
  ) { }
  
  }
  
