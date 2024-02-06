import { Component, OnDestroy, OnInit,Inject, ChangeDetectionStrategy,ChangeDetectorRef  } from '@angular/core';
import { Call, Lead } from '../../lead.type';
import { EMPTY, Observable, Subject, catchError, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeadService } from '../../lead.service';
import moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-lead-score',
  templateUrl: './lead-score.component.html',

})
export class LeadScoreComponent implements OnInit , OnDestroy {
  lead: Lead
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  composeForm: UntypedFormGroup;
 
  QuestionsList :any[];
  

  onRatingClick(questionIndex: number, rating: number): void {
    const question = this.QuestionsList[questionIndex];
    if (question.rating === rating) {
      rating = 0;
    }
    this.QuestionsList[questionIndex].rating = rating;
    this.QuestionsList = [...this.QuestionsList]; 
  }
  constructor(
      public matDialogRef: MatDialogRef<LeadScoreComponent>,
      private _leadService: LeadService,
      private cdr: ChangeDetectorRef,
      private _snackBar: MatSnackBar
  ) {

   
  }

 
  ngOnDestroy(): void {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

 
  ngOnInit(): void {
    
    this._leadService.lead$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data =>
      { this.lead = { ...data }
    })

      this.GetLeadScore();
   
     }

  createForm() {
    

  }



  close(): void {
    this.matDialogRef.close();
  }

  discard(): void {
    this.matDialogRef.close();
}

GetLeadScore() {

  this._leadService.getScoreList(this.lead.leadId).subscribe(
    scores => {
      this.QuestionsList = scores;
    }
  );
}
SaveLeadScore() {

  this._leadService.saveleadScore(this.QuestionsList, this.lead.leadId).subscribe((data) => {
    this.matDialogRef.close()
    this.showSuccessSnackbar('Lead Qualification Saved');
    
  
  });

}
private showSuccessSnackbar(message: string): void {
  this._snackBar.open(message, 'Close', {
    duration: 3000, // Duration in milliseconds
    panelClass: ['success-snackbar'] // Apply a custom CSS class for styling
  });
}


}
