import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, combineLatest, map } from 'rxjs';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';
import { LeadMonthly, LeadStatus } from './lead-monthly.type';
import { LeadMonthlyService } from './lead-monthly.service';

@Component({
  selector: 'app-lead-monthly',
  templateUrl: './lead-monthly.component.html',
  styleUrls: ['./lead-monthly.component.scss'],
})
export class LeadMonthlyComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('exporter') public exporter;
originalData: LeadMonthly[];
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
  selectedYear: number; // Add this variable to store the selected year
  years: number[] = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, index) => new Date().getFullYear() - index);
  currentYear: number = new Date().getFullYear()

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _leadMonthlyService: LeadMonthlyService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
  ) {}


  reports$ = this._leadMonthlyService.leadMonthly$;
  monthly$ = this.reports$.pipe(
    map((reports) => reports.map((r) => ({ ...r } as LeadMonthly))),
    map((reports) => this.generateEmptyMonths(reports).concat(reports))
  );

  generateEmptyMonths(reports: LeadMonthly[]): LeadMonthly[] {
    const allMonths: LeadMonthly[] = [];
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
  
    for (let year = currentYear; year >= currentYear - 20; year--) {
      for (const month of months) {
        const existingMonth = reports.find((r) => r.year === year && r.month === month);
  
        if (existingMonth) {
          allMonths.push(existingMonth);
        } else {
          allMonths.push({
            year: year,
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
    }
  
    return allMonths;
  }

  ngOnInit(): void {
    this.monthly$.subscribe((report) => {
      const emptyMonths = this.generateEmptyMonths(report);
      this.leadMonthlyCount = emptyMonths.length;
      this.originalData = emptyMonths;
      this.dataSource = new MatTableDataSource(emptyMonths);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this._changeDetectorRef.markForCheck();
    });
    this.filterByYear(this.currentYear);
    this.leadStatusTypes = this.getUniqueLeadStatusTypes();
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    // Check if the filter value is empty
    if (filterValue === '') {
      // If empty, reset the filter to show the original data
      this.dataSource.data = this.originalData;
  
      // Reset paginator to the first page
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      // If not empty, filter based on the first letter of month names
      const filteredData = this.dataSource.data.filter(row =>
        (this.monthToWord(row.month).toLowerCase().startsWith(filterValue) ||
         this.monthToWord(row.month).toLowerCase().includes(' ' + filterValue))
        && (!this.selectedYear || row.year === this.selectedYear)
      );
  
      // Update the data source with the filtered data
      this.dataSource.data = filteredData;
  
      // Reset paginator to the first page
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  monthToWord(month: number): string {
    // Implement your logic to convert month number to word
    // For example, you can use an array of month names
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month - 1] || '';
  }

  filterByYear(year: number) {
    this.selectedYear = year;
    this.dataSource.filter = this.selectedYear.toString();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  addView() {}

  onYearSelected(year: number) {
    this.filterByYear(year);
  }
  
}
