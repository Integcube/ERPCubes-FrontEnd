import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { LeadReportService } from './lead-report.service';
import { Subject, combineLatest, map, takeUntil } from 'rxjs';
import { LeadReport } from './lead-report.type';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-lead-report',
  templateUrl: './lead-report.component.html',
  styleUrls: ['./lead-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadReportComponent  {

  constructor(private _leadReportService: LeadReportService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  users$ = this._leadReportService.users$
  leadStatus$ = this._leadReportService.leadStatus$
  product$ = this._leadReportService.prodcts$
  leadReportWithUser$ = combineLatest(
    this._leadReportService.users$,
    this._leadReportService.leadReport$
  ).pipe(
    map(([users, reports]) => reports.map(r => ({
      ...r,
      leadOwnerName: users.find(a => a.id === r.leadOwner)?.name
    } as LeadReport)))
  )
}
