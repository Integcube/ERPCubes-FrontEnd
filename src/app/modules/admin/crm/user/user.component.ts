import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
