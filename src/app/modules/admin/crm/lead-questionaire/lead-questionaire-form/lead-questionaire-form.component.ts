import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Question } from '../lead-questionaire.type';
import { LeadQuestionaireService } from '../lead-questionaire.service';
import { LeadQuestionaireListComponent } from '../lead-questionaire-list/lead-questionaire-list.component';
import { Subject, filter, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-lead-questionaire-form',
  templateUrl: './lead-questionaire-form.component.html',
  styleUrls: ['./lead-questionaire-form.component.scss']
})
export class LeadQuestionaireFormComponent implements OnInit {
  @ViewChild('title') private _titleField: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  // private questionsSubject = new Subject<Question[]>()
  // questions$ = this.questionsSubject.asObservable();
  questions: Question[] = [];
  selectedQuestion: Question = new Question({});
  dataSource: MatTableDataSource<Question>;
  weightageList = [
    {weightage: 0.1, title: "10%"},
    {weightage: 0.2, title: "20%"},
    {weightage: 0.3, title: "30%"},
    {weightage: 0.4, title: "40%"},
    {weightage: 0.5, title: "50%"},
    {weightage: 0.6, title: "60%"},
    {weightage: 0.7, title: "70%"},
    {weightage: 0.8, title: "80%"},
    {weightage: 0.9, title: "90%"},
    {weightage: 1.0, title: "100%"}
  ]
  editMode: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  showDeleteConfirmationDialog: boolean = false;
  private deleteConfirmationDialogRef: MatDialogRef<any>;
  get _deleteConfirmationDialogRef(): MatDialogRef<any> {
    return this.deleteConfirmationDialogRef;
  }
  constructor(
    private matDialogRef: MatDialogRef<LeadQuestionaireFormComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private _data: { selectedQuestions: Question[] },
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _questionaireService: LeadQuestionaireService,
  ) { }
  
  ngOnInit(): void {
    // this.questions$ = this._questionaireService.questions$;
    // this._questionaireService.questions$
    // .pipe(takeUntil(this._unsubscribeAll))
    // .subscribe((questions: Question[]) => {
    //   debugger;
    //   this.questions = { ...questions };
    //   this.dataSource = new MatTableDataSource(this.questions);
    //   this.dataSource.sort = this.sort;
    //   // Move the creation of questionaireForm inside the subscription
    //   this._changeDetectorRef.markForCheck();
    // });
    this.questions = this._data.selectedQuestions;
    this.dataSource = new MatTableDataSource(this.questions);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


  previewQuestion(question: Question){
    this._questionaireService.selectedQuestion(question.questionId).subscribe();
  }

  addQuestion() {
    this.selectedQuestion = new Question({})
  }

  updateQuestion(id: number){
    this._questionaireService.selectedQuestion(id).subscribe(
      question => {
        this.selectedQuestion = question;
      }
    );
  }

  save() {
    this.questions.push( this.selectedQuestion)
    this.selectedQuestion = null
    this._questionaireService.saveQuestionaire(this.questions).subscribe()
    this.close();
  }

  delete() {
     // Open the confirmation dialog
     const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Questionaire',
      message: 'Are you sure you want to delete this Questionaire?',
      actions: {
        confirm: {
          label: 'Delete'
        }
      }
    });
    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // this.selectedQuestions = { ...this.questionaireForm.value }
        // this._questionaireService.deleteQuestions(this.selectedQuestions).subscribe(
        //   {
        //     next: () => {
        //       this._leadQuestionaireListComponent.onBackdropClicked();
        //       this.closeDrawer();
        //       this._changeDetectorRef.markForCheck();
        //     }
        //   }
        // );
      }
    });
  }

  close(): void {
    this.matDialogRef.close();
  }

  discard(): void {
    this.matDialogRef.close();
}

}


