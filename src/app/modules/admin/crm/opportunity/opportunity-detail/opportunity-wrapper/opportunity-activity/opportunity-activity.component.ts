import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { OpportunityService } from '../../../opportunity.service';

@Component({
  selector: 'app-opportunity-activity',
  templateUrl: './opportunity-activity.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class OpportunityActivityComponent implements OnInit {
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  
  constructor(
    private _opportunityService:OpportunityService,
    private _changeDetectorRef: ChangeDetectorRef )
  { }

  ngOnInit(): void {
    this._opportunityService.updateSearchQuery(null);
    this.searchInputControl.valueChanges.subscribe((value) => {
     this._opportunityService.updateSearchQuery(value);
     this._changeDetectorRef.markForCheck();
    });
  }
  applyFilter(event){

  }
}
