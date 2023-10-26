import { ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CompanyComponent {

  constructor() { }



}
