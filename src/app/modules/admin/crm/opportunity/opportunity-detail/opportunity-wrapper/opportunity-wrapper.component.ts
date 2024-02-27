import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-opportunity-wrapper',
  templateUrl: './opportunity-wrapper.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class OpportunityWrapperComponent {

  private _tab : BehaviorSubject<"overview"|"activity"> = new BehaviorSubject("activity");
  tab$ = this._tab.asObservable();
  constructor() { }
  updateTab(tab:"overview"|"activity"){
    this._tab.next(tab);
  }
}
