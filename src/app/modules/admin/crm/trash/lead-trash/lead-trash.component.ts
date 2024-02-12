import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subject, combineLatest, debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { DeletedLeads } from '../trash.type';
import { TrashService } from '../trash.service';
import { Lead } from '../../lead/lead.type';
import { LeadService } from '../../lead/lead.service';


@Component({
  selector: 'app-lead-trash',
  templateUrl: './lead-trash.component.html',
  styleUrls: ['./lead-trash.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadTrashComponent implements OnInit {
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  dataSource: MatTableDataSource<DeletedLeads>;
  dataSourceLead: MatTableDataSource<Lead>;

  selection = new SelectionModel<DeletedLeads>(true, []);
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  leads: DeletedLeads[];
  deletedUsers: string[] = [];

  allLeads: Lead[];
  // displayedColumns: string[] = ['Product Name', 'Restore', 'Created By'];
  deletedLeads$: Observable<DeletedLeads[]>;
  constructor(
    private _leadService: TrashService,
    private _allLeadService: LeadService,

    private _matDialogRef: MatDialogRef<LeadTrashComponent>,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  getDeletedFilters(): void {
    this._leadService.getDeletedLeads().subscribe((leads: DeletedLeads[]) => {
      this.deletedUsers = Array.from(new Set(leads.map(lead => lead.deletedBy)));
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnInit(): void {
    this.deletedLeads$ = this._leadService.getDeletedLeads();
    this.getDeletedFilters();
    this._leadService.deletedLeads$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((leads: DeletedLeads[]) => {
        this.leads = [...leads];
        this.dataSource = new MatTableDataSource(this.leads);
        this._changeDetectorRef.markForCheck();
      });

    this.searchInputControl.valueChanges
      .pipe(
        debounceTime(300), // Adjust debounce time as needed
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(searchTerm => {
        this.deletedLeads$ = this._leadService.getDeletedLeads().pipe(
          map(leads => leads.filter(lead =>
            lead.firstName.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        );

        this._changeDetectorRef.markForCheck();
      });
  }

  restoreLead(lead: DeletedLeads): void {
    this._leadService.restoreLead(lead).subscribe(() => {
      this.deletedLeads$ = this._leadService.getDeletedLeads();
      this._changeDetectorRef.markForCheck();
    });
  }


  // Update restoreBulkProduct method
  restoreBulkLead(): void {
    if (this.isAnyLeadSelected()) {
      const selectedLeadIds = this.selectedLeads.map(lead => lead.leadId);

      this._leadService.restoreBulkLeads(selectedLeadIds).subscribe(() => {
        this.deletedLeads$ = this._leadService.getDeletedLeads();

        this._leadService.getDeletedLeads().subscribe((leads: DeletedLeads[]) => {
          this.dataSource.data = leads;
          this.selectedLeads = [];
          this._changeDetectorRef.markForCheck();
        });
      });

    }
  }



  selectedLeads: DeletedLeads[] = [];

  toggleSelection(event: MatCheckboxChange, lead: DeletedLeads): void {
    if (event.checked) {
      this.selectedLeads.push(lead);
    } else {
      this.selectedLeads = this.selectedLeads.filter(selectedProduct => selectedProduct !== lead);
    }
  }



  isAnyLeadSelected(): boolean {
    return this.selectedLeads.length > 0;
  }



  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  closeDialog() {
    this._matDialogRef.close();

    this._allLeadService.getLeads().subscribe((allLeads: Lead[]) => {
      this.allLeads = [...allLeads];
      this.dataSourceLead = new MatTableDataSource(this.allLeads);
      this._changeDetectorRef.markForCheck();
    });
  }



  filterByUser(user: string): void {
    if (user === 'All Users') {
      this.deletedLeads$ = this._leadService.getDeletedLeads();
    } else {
      this.deletedLeads$ = this._leadService.getDeletedLeads().pipe(
        map(leads => leads.filter(lead => lead.deletedBy === user))
      );
    }
    this._changeDetectorRef.markForCheck();
  }

}