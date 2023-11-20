import { ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-activity',
  templateUrl: './company-activity.component.html',
  styleUrls: ['./company-activity.component.scss'],

})
export class CompanyActivityComponent implements OnInit {
  panelOpenState:boolean
  constructor() { }

  ngOnInit(): void {
  }
  
  applyFilter(event){

  }
}
