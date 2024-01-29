import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-company-wrapper',
  templateUrl: './company-wrapper.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class CompanyWrapperComponent {
  private _tab : BehaviorSubject<"overview"|"activity"> = new BehaviorSubject("overview");
  
  tab$ = this._tab.asObservable();
  
  constructor() { }

  updateTab(tab:"overview"|"activity"){
    this._tab.next(tab);
  }
}
