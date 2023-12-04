import { ChangeDetectionStrategy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-lead-wrapper',
  templateUrl: './lead-wrapper.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class LeadWrapperComponent {
  private _tab : BehaviorSubject<"overview"|"activity"> = new BehaviorSubject("activity");
  tab$ = this._tab.asObservable();
  constructor() { }
  updateTab(tab:"overview"|"activity"){
    this._tab.next(tab);
  }


}
