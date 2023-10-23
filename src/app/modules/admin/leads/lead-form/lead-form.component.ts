import { Component, OnInit } from '@angular/core';
import { LeadListComponent } from '../lead-list/lead-list.component';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss']
})
export class LeadFormComponent implements OnInit {
  leadForm: UntypedFormGroup;
  editMode: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _leadListComponent: LeadListComponent
  ) { }
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
    this._leadListComponent.matDrawer.open();
    this.leadForm = this._formBuilder.group({
      leadId: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
      leadStatus: [''],
      companyId: [''],
      saleOwner: [''],
      assignedTo: [''],
      mobile: [''],
      work: [''],
      address: [''],
      street: [''],
      city: [''],
      zip: [''],
      state: [''],
      country: [''],
      leadSourceId: [''],
      leadIndustryId: [''],
    });

  }
  saveLead() {
  }
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._leadListComponent.matDrawer.close();
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
