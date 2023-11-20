import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lead-overview',
  templateUrl: './lead-overview.component.html',
  styleUrls: ['./lead-overview.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class LeadOverviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
