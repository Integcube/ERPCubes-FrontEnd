import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { settingsRoutes } from './settings.routing';



@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    RouterModule.forChild(settingsRoutes),
    CommonModule,
    SharedModule
  ]
})
export class SettingsModule { }
