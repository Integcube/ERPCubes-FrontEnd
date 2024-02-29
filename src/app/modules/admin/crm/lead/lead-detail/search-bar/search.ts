import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LeadService } from '../../lead.service';
@Component({
    selector: 'search-bar',
    templateUrl: './search.html',
    styleUrls: ['./search.scss'],
})
export class SearchBarComponent implements OnInit {
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  
  constructor(
    private _opportunityService:LeadService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this._opportunityService.updateSearchQuery(null);
    this.searchInputControl.valueChanges.subscribe((value) => {
     this._opportunityService.updateSearchQuery(value);
     this._changeDetectorRef.markForCheck();
    });
  }
  
}
