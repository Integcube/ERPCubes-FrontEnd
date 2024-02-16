import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Product, Question } from '../lead-questionaire.type';
import { LeadQuestionaireService } from '../lead-questionaire.service';
import { Observable, Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-copy-question',
  templateUrl: './copy-question-form.component.html',
  styleUrls: ['./copy-question-form.component.scss']
})
export class CopyQuestionformComponent implements OnInit {
  questions: Question[] = [];
  products: Product[] = [];
  prodId:number;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private matDialogRef: MatDialogRef<CopyQuestionformComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public selecteddata: any,
    private _fuseConfirmationService: FuseConfirmationService,
    private _questionaireService: LeadQuestionaireService,
  ) { }
  product$ = this._questionaireService.products$
  
  
  ngOnInit(): void {
    this.prodId=-1;

    this._questionaireService.copyquestions$.subscribe(data=>{
      if (data) {
        this.questions = [...data];
      }
    });
    this.questions.length=0;

  }

  
  onSelectionChange(proId: number){
    this._questionaireService.getQuestion(proId).subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


  saveAndClose() {
    this._questionaireService.saveCopyQuestion(this.questions).subscribe(
      () => {
        this.close();
      },
      error => {
        console.error(error);
      }
    );
  }
  

  close(): void {
    this.matDialogRef.close();
  }

}


