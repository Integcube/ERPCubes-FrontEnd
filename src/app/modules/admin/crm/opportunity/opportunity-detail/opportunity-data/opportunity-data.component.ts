import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opportunity-data',
  templateUrl: './opportunity-data.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class OpportunityDataComponent implements OnInit {
  panelOpenState:boolean
  constructor() { }

  ngOnInit(): void {
  }

}
