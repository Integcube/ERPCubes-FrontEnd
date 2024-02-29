import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',  
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunityComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
