import { NgModule } from '@angular/core';
import { Example2Component } from './example2.component';
import { Route, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';

const example2Routes: Route[] = [
  {
      path     : '',
      component: Example2Component
  }
];

@NgModule({
  declarations: [
    Example2Component
  ],
  imports: [
    RouterModule.forChild(example2Routes),
    MatTableModule,


  ]
})
export class Example2Module { }
