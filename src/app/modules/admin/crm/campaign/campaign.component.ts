import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CampaignComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
