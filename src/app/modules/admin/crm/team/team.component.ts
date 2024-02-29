import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TeamComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
