import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFormComponent } from './custom-form.component';
import { FormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { customFormRoutes } from './custom-form.routing';



@NgModule({
  declarations: [
    CustomFormComponent
  ],
  imports: [
    RouterModule.forChild(customFormRoutes),
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatMomentDateModule,
    FormsModule,
    CommonModule,
    SharedModule
  ],
})
export class CustomFormModule { }