import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebFormComponent } from './web-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { webFormRoutes } from './web-form.routing';
import { SplitPipe } from '@fuse/pipes/split/split.pipe';



@NgModule({
  declarations: [
    WebFormComponent,
    SplitPipe
  ],
  imports: [
    RouterModule.forChild(webFormRoutes),
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatMomentDateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule
  ],
})
export class WebFormModule { }