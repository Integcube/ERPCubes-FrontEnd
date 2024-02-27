import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { CompanyService } from '../../../company.service';

@Component({
  selector: 'app-company-activity',
  templateUrl: './company-activity.component.html',
  styleUrls: ['./company-activity.component.scss'],
})
export class CompanyActivityComponent implements OnInit {
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  panelOpenState:boolean
  constructor(
    private _companyService:CompanyService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }
    
  ngOnInit(): void {
    this._companyService.updateSearchQuery(null);
    this.searchInputControl.valueChanges.subscribe((value) => {
     this._companyService.updateSearchQuery(value);
     this._changeDetectorRef.markForCheck();
    });
  }
  
  applyFilter(event){

  }
}
