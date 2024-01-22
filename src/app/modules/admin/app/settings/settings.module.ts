import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { settingsRoutes } from './settings.routing';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';



@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    RouterModule.forChild(settingsRoutes),
    FuseCardModule,
    MatExpansionModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    SharedModule
  ]
})
export class SettingsModule { }
