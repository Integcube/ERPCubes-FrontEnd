import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TeamComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
