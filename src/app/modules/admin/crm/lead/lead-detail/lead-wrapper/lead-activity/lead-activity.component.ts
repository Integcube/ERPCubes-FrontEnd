import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { LeadService } from '../../../lead.service';

@Component({
  selector: 'app-lead-activity',
  templateUrl: './lead-activity.component.html',
  styleUrls: ['./lead-activity.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class LeadActivityComponent implements OnInit {
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  
  constructor(
    private _leadService:LeadService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this._leadService.updateSearchQuery(null);
    this.searchInputControl.valueChanges.subscribe((value) => {
     this._leadService.updateSearchQuery(value);
     this._changeDetectorRef.markForCheck();
    });
  }
  applyFilter(event){

  }
}
