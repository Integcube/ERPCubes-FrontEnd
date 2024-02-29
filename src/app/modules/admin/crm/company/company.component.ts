import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CompanyComponent {

  constructor() { }



}
