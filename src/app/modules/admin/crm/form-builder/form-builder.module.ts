import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilderListComponent } from './form-builder-list/form-builder-list.component';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { FormConfiguratorComponent } from './form-configurator/form-configurator.component';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import moment from 'moment';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { formBuilderRoutes } from './form-builder.routing';
import { FormBuilderComponent } from './form-builder.component';
import { FieldMenuComponent } from './config/field-menu/field-menu.component';
import { FieldSettingsComponent } from './config/field-settings/field-settings.component';



@NgModule({
  declarations: [
    FormBuilderListComponent,
    FormDialogComponent,
    FormConfiguratorComponent,
    FormBuilderComponent,
    FieldMenuComponent,
    FieldSettingsComponent
  ],
  imports: [
    RouterModule.forChild(formBuilderRoutes),
    MatButtonModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatTooltipModule,
    MatExpansionModule,
    MatTabsModule,
    MatDialogModule,
    FuseFindByKeyPipeModule,
    FormsModule,
    FuseCardModule,
    DragDropModule,
    QuillModule,
    SharedModule  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: moment.ISO_8601
        },
        display: {
          dateInput: 'll',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      }
    }
  ]
})
export class FormBuilderModule { }
