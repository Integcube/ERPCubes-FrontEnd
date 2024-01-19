import { LeadReportService } from './lead-report.service';
import { LeadReport, LeadStatus, Product } from "./lead-report.type";
import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subject} from 'rxjs';

@Component({
  selector: 'app-lead-report',
  templateUrl: './lead-report.component.html',
  styleUrls: ['./lead-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadReportComponent implements OnInit, OnDestroy {
  constructor(
    private _leadReportService: LeadReportService,
    private _changeDetectorRef: ChangeDetectorRef
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
}