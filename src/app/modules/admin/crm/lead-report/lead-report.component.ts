import { LeadReportService } from './lead-report.service';
import { LeadReport, LeadStatus, Product } from "./lead-report.type";
import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild } from '@angular/core';
import { ExcelService } from 'app/shared/shared.service';
import { Subject} from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-lead-report',
  templateUrl: './lead-report.component.html',
  styleUrls: ['./lead-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadReportComponent implements OnInit, OnDestroy {
  
  constructor(
    private _leadReportService: LeadReportService,
    private _changeDetectorRef: ChangeDetectorRef,
    private ExcelServe: ExcelService
  ) { }
  prodId:number
  startDate: Date
  endDate: Date
  leadReportCount: number = 0;
  _unsubscribeAll: Subject<any> = new Subject<any>();
  users$ = this._leadReportService.users$
  leadStatus$ = this._leadReportService.leadStatus$
  product$ = this._leadReportService.prodcts$
  
  leadReportWithUser$ =   this._leadReportService.leadReport$;
  products: Product[] = [];
  status: LeadStatus[] = [];
  userList: LeadReport[] = [];
  HeaderConfig: { key: string; label: string }[] = [];
  ngOnInit(): void {
   
    this.startDate = new Date();
    this.endDate=new Date();
    this.prodId=-1;
    this.leadReportWithUser$.subscribe((report) => {
      this.leadReportCount = report.length;
      this.userList = [...report];

      this._changeDetectorRef.markForCheck();
    });
    this.leadStatus$.subscribe(
      data => { this.status = [...data] }
    );
    this.product$.subscribe(
      data=>{this.products = [...data] }
    );
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  getLeadReports(){
    this._leadReportService.getLeadReport(this.startDate.toISOString(), this.endDate.toISOString(), this.prodId).subscribe();
  }

  
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  exportToExcel(): void {
    const dataToExport = this.userList; // Or any other data you want to export
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'LeadReports');

    // Trigger the download
    XLSX.writeFile(wb, 'lead_reports.xlsx', { bookType: 'xlsx' });
  }
  Export(){

    this.HeaderConfig=[
      
      {key:'firstName',label:"Name"},
      {key:'leadStatusTitle',label:"Lead Status"},
      {key:'productName',label:"Product Name"},
      {key:'productId',label:"Product"},
      {key:'count',label:"Count"},
    ]


    
    this.ExcelServe.exportToExcel(this.userList, this.HeaderConfig, 'Lead-Report.xlsx');
      }
}