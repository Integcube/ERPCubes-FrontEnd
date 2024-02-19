import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, combineLatest, map } from 'rxjs';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';
import { LeadMonthly, LeadMonthlyFilter, LeadStatus } from './lead-monthly.type';
import { LeadMonthlyService } from './lead-monthly.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';

class CustomDateAdapter extends NativeDateAdapter {
  format(date: Date): string {
    return `${date.getFullYear()}`;
  }
}

@Component({
  selector: 'app-lead-monthly',
  templateUrl: './lead-monthly.component.html',
  styleUrls: ['./lead-monthly.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: { dateInput: 'YYYY' },
        display: { dateInput: 'YYYY', monthYearLabel: 'YYYY', dateA11yLabel: 'LL', monthYearA11yLabel: 'YYYY' },
      },
    },
  ],
})
export class LeadMonthlyComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('exporter') public exporter;
  dataSource: MatTableDataSource<LeadMonthly>;
  displayedColumns: string[] = [
    'month',
    'totalLeads',
    'newLead',
    'contactedLead',
    'interestedLead',
    'qualifiedLead',
    'lostLead',
    'wonLead',
  ];
  selection = new SelectionModel<LeadMonthly>(true, []);
  leadMonthlyCount: number = 0;
  leadStatusTypes: string[];
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  totalLeads: number = 0;
  totalNewLeads: number = 0;
  totalContactedLeads: number = 0;
  totalInterestedLeads: number = 0;
  totalQualifiedLeads: number = 0;
  totalLostLeads: number = 0;
  totalWonLeads: number = 0;
  _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _leadMonthlyService: LeadMonthlyService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
  ) {}

  leadMonthlyFilter: LeadMonthlyFilter = new LeadMonthlyFilter({});
  users$ = this._leadMonthlyService.users$
  products$ = this._leadMonthlyService.products$
  leadSources$ = this._leadMonthlyService.leadSources$;
  reports$ = this._leadMonthlyService.leadMonthly$;
  monthly$ = this.reports$.pipe(
    map((reports) => reports.map((r) => ({ ...r } as LeadMonthly))),
    map((reports) => this.generateEmptyMonths(reports))
  );

  ngOnInit(): void {
    this.monthly$.subscribe((report) => {
      const emptyMonths = this.generateEmptyMonths(report);
      const sumOfTotalLeads = report.reduce((sum, monthly) => sum + (monthly.totalLeads || 0), 0);
      this.leadMonthlyCount = sumOfTotalLeads;
  
      
      this.dataSource = new MatTableDataSource(report? report : emptyMonths);
      this._changeDetectorRef.markForCheck();
    });
    this.leadStatusTypes = this.getUniqueLeadStatusTypes();
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  getLeadMonthlyReports() {
    this._leadMonthlyService.getLeadMonthly(this.leadMonthlyFilter).subscribe();
  }

  public onYearSelected(date: Date, datepicker: MatDatepicker<Date>) {
    const normalizedYear = date.getFullYear();
    this.leadMonthlyFilter.year = new Date(normalizedYear, 12, 0);
    datepicker.close();
  }

  generateEmptyMonths(reports: LeadMonthly[]): LeadMonthly[] {
    const allMonths: LeadMonthly[] = [];
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
  

      for (const month of months) {
        const existingMonth = reports.find((r) => r.month === month);
  
        if (existingMonth) {
          allMonths.push(existingMonth);
        } else {
          allMonths.push({
            year: currentYear,
            month: month,
            totalLeads: 0,
            leadStatusList: [], // Initialize leadStatusList as an empty array
            newLead: 0,
            contactedLead: 0,
            interestedLead: 0,
            qualifiedLead: 0,
            lostLead: 0,
            wonLead: 0,
          });
        }
      }

  
    return allMonths;
  }

  getUniqueLeadStatusTypes(): string[] {
    const leadStatusTypes = new Set<string>();
    
    // Iterate over the data to collect unique lead status types
    this.dataSource.data.forEach((row) => {
      row.leadStatusList.forEach((status) => {
        leadStatusTypes.add(status.statusTitle);
      });
    });

    // Convert the Set to an array
    return Array.from(leadStatusTypes);
  }

  getLeadStatusCount(leadStatusList: LeadStatus[], statusTitle: string): number {
    const status = leadStatusList.find((status) => status.statusTitle === statusTitle);
    return status ? status.count : 0;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: LeadMonthly): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.month + 1
    }`;
  }

  monthToWord(month: number): string {
    // Implement your logic to convert month number to word
    // For example, you can use an array of month names
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month - 1] || '';
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  
}
