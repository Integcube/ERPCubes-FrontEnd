import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AssignChecklistRouting } from './assign-checklist.routing';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { MatSortModule } from '@angular/material/sort';
import { AssignChecklistComponent } from './assign-checklist.component';
import { AssignDialogComponent } from './assign-dialog/assign-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AssignChecklistComponent,
    AssignDialogComponent
  ],
  imports: [
    RouterModule.forChild(AssignChecklistRouting),
    CommonModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCheckboxModule,
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
    SharedModule,
    FuseScrollbarModule,
    MatSortModule,
    MatDialogModule
  ]
})
export class AssignChecklistModule { }
