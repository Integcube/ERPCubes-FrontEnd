import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { companyRoutes } from '../company/company.routing';
import moment from 'moment';
import { productRoutes } from './product.routing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProductImportComponent } from './product-import/product-import.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableExporterModule } from 'mat-table-exporter';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseCardModule } from '@fuse/components/card';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    ProductComponent,
    ProductListComponent,
    ProductFormComponent,
    ProductImportComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(productRoutes),
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
    MatStepperModule,
    MatSidenavModule,
    MatTableModule,
    MatTableExporterModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatTabsModule,
    MatDialogModule,
    MatStepperModule,
    FormsModule,
    FuseCardModule,
    FuseDrawerModule,
    FuseFindByKeyPipeModule,
    FuseScrollbarModule,
    DragDropModule,
    QuillModule,
    SharedModule,    
  ],
  providers   : [
    {
        provide : MAT_DATE_FORMATS,
        useValue: {
            parse  : {
                dateInput: moment.ISO_8601
            },
            display: {
                dateInput         : 'LL',
                monthYearLabel    : 'MMM YYYY',
                dateA11yLabel     : 'LL',
                monthYearA11yLabel: 'MMMM YYYY'
            }
        }
    }
  ]
})
export class ProductModule { }
