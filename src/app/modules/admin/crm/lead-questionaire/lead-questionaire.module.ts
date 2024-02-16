import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadQuestionaireComponent } from './lead-questionaire.component';
import { LeadQuestionaireFormComponent } from './lead-questionaire-form/lead-questionaire-form.component';
import { LeadQuestionaireListComponent } from './lead-questionaire-list/lead-questionaire-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { questionaireRoutes } from './lead-questionaire.routing';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { FuseCardModule } from '@fuse/components/card';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { CopyQuestionformComponent } from './copy-question-form/copy-question-form.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [
    LeadQuestionaireComponent,
    LeadQuestionaireFormComponent,
    LeadQuestionaireListComponent,
    CopyQuestionformComponent
  ],
  imports: [
    RouterModule.forChild(questionaireRoutes),
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatExpansionModule,
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
    MatTooltipModule,
    MatPaginatorModule,
    FuseCardModule,
    FuseDrawerModule,
    FuseScrollbarModule,
    CommonModule,
    SharedModule,
    MatDialogModule
  ]
})
export class LeadQuestionaireModule { }
