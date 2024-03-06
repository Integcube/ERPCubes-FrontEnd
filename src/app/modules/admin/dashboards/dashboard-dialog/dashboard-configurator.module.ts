import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardConfiguratorComponent } from './dashboard-configurator.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'app/shared/shared.module';
import {MatStepperModule} from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { NewDashboardDialogComponent } from '../newdashboard-dialog/newdashboard-dialog.component';

@NgModule({
  declarations: [
    DashboardConfiguratorComponent,
    NewDashboardDialogComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    SharedModule,
    MatInputModule,
    MatStepperModule,
    MatRadioModule,
    MatButtonModule,
  ],
  exports:[
    DashboardConfiguratorComponent
  ]
})
export class DashboardConfiguratorModule { }
