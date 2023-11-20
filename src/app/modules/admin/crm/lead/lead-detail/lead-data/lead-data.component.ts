import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lead-data',
  templateUrl: './lead-data.component.html',
  styleUrls: ['./lead-data.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class LeadDataComponent implements OnInit {
  panelOpenState:boolean

  constructor() { }

  ngOnInit(): void {
  }

}
