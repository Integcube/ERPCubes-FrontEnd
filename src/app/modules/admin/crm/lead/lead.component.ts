import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',  
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadComponent {

  constructor() { }

}
