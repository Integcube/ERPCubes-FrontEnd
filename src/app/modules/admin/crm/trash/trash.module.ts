import { ChangeDetectorRef, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
// import { TrashComponent } from './trash.component';
import { trashRoutes } from './trash.routing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { MatTableExporterModule } from 'mat-table-exporter';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';
import { TrashComponent } from './trash.component';



@NgModule({
    declarations: [
        TrashComponent,

        
    ],
    imports     : [
        CommonModule,
        RouterModule.forChild(trashRoutes),
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
    ]
})
export class TrashModule
{
}