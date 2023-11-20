import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil, catchError, EMPTY } from 'rxjs';
import { LeadService } from '../../lead.service';
import { Lead, Note, TaskModel } from '../../lead.type';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { NoteDetailComponent } from '../notes/note-detail/note-detail.component';
import { TaskDetailComponent } from '../tasks/task-detail/task-detail.component';

@Component({
  selector: 'app-lead-info',
  templateUrl: './lead-info.component.html',
  styleUrls: ['./lead-info.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class LeadInfoComponent implements OnInit, OnDestroy {

  selectedLead: Lead;
  leadForm: FormGroup;
  users$ = this._leadService.users$;
  industries$ = this._leadService.industries$;
  leadStatus$ = this._leadService.leadStatus$;
  leadSource$ = this._leadService.leadSource$;
  product$ = this._leadService.product$;
  private errorMessageSubject = new Subject<string>();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  constructor(private _formBuilder: FormBuilder,
    private _leadService: LeadService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog,

    ) {
  }
  save() {
    this.selectedLead = { ...this.leadForm.value }
    this._leadService.saveLead(this.selectedLead).subscribe(
      {
        next: () => {
          this._changeDetectorRef.markForCheck();

        },
        error: err => {
          alert(`Daniyal:${JSON.stringify(err)}`)
        }
      }
    );
  }
  ngOnInit(): void {
    this.leadForm = this._formBuilder.group({
      leadId: [, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [''],
      leadOwner: ['', Validators.required],
      status: [''],
      mobile: [''],
      work: [''],
      address: [''],
      street: [''],
      city: [''],
      zip: [''],
      state: [''],
      country: [''],
      sourceId: [''],
      industryId: [''],
      productId: [''],
      createdDate: ['']
    });
    this._leadService.lead$.pipe(takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }))
      .subscribe((company: Lead) => {
        this.selectedLead = { ...company };
        this.leadForm.patchValue(company, { emitEvent: false });
        this._changeDetectorRef.markForCheck();
      });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  addNote(){
    let note = new Note({})
    this._matDialog.open(NoteDetailComponent, {
      autoFocus: false,
      data     : {
          note: cloneDeep(note)
      }
  });
  }
  addTask(){
    let tasks = new TaskModel({})
    this._matDialog.open(TaskDetailComponent, {
      autoFocus: false,
      data     : {
          task: cloneDeep(tasks)
      }
  });
  }
}
