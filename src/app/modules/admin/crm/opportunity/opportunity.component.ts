import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',    
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunityComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
