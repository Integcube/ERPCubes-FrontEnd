import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Product, Question } from '../lead-questionaire.type';
import { LeadQuestionaireService } from '../lead-questionaire.service';
import { Observable, Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CopyQuestionformComponent } from '../copy-question-form/copy-question-form.component';

@Component({
  selector: 'app-lead-questionaire-form',
  templateUrl: './lead-questionaire-form.component.html',
  styleUrls: ['./lead-questionaire-form.component.scss']
})
export class LeadQuestionaireFormComponent implements OnInit {
  questions: Question[] = [];
  weightageList = [
    {weightage: 0.05, title: "5%"},
    {weightage: 0.1, title: "10%"},
    {weightage: 0.15, title: "15%"},
    {weightage: 0.2, title:  "20%"},
    {weightage: 0.25, title: "25%"},
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

  constructor(
    private matDialogRef: MatDialogRef<LeadQuestionaireFormComponent>,
    public _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public selecteddata: any,
    private _questionaireService: LeadQuestionaireService,
  ) { }
  
  ngOnInit(): void {
    this._questionaireService.questions$.subscribe(data=>{
      if (data) {
        this.questions = [...data];
      }
    });

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  addQuestion(){
    const emptyQuestion = new Question({});
    this._questionaireService.saveQuestion(emptyQuestion).subscribe();
  }

  saveQuestion(question: Question){
    this._questionaireService.saveQuestion(question).subscribe();
  }

  delete(question: Question) {
    this._questionaireService.deleteQuestion(question).subscribe();
  }

  close(): void {
    this.matDialogRef.close();
  }
  openConnectorDialog() {
  
    this._dialog.open(CopyQuestionformComponent, {
      autoFocus: false,
      data:this.selecteddata
    });
  }
}


