import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateChecklistRouting } from './create-checklist.routing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
import { SharedModule } from 'app/shared/shared.module';
import { MatTableExporterModule } from 'mat-table-exporter';
import { QuillModule } from 'ngx-quill';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CreateChecklistComponent } from './create-checklist.component';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChecklistDialogComponent } from './checklist-dialog/checklist-dialog.component';
import { CreateChecklistformComponent } from './create-checklistform/create-checklistform.component';



@NgModule({
  declarations: [
    CreateChecklistComponent,
    ChecklistDialogComponent,
    CreateChecklistformComponent
  ],
  imports: [
    RouterModule.forChild(CreateChecklistRouting),
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSidenavModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    SharedModule,
    FuseScrollbarModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    MatTableExporterModule,
    MatExpansionModule,
    MatDialogModule,
    MatStepperModule,
    FormsModule,
    FuseCardModule,
    FuseDrawerModule,
    FuseFindByKeyPipeModule,
    DragDropModule,
    QuillModule,
    MatSortModule,
    MatSlideToggleModule
  ]
})
export class CreateChecklistModule { }
