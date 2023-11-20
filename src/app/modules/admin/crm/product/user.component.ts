import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit {

  constructor() { debugger;}

  ngOnInit(): void {
  }

}
