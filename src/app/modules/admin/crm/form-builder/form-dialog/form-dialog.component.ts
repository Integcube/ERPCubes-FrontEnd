import { Component, Inject, OnInit } from '@angular/core';
import { Form } from '../form-builder.type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilderService } from '../form-builder.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
})
export class FormDialogComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { form: Form },
    private _formBuilderService: FormBuilderService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,)
  { }
  

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  customForm: FormGroup
  selectedForm: Form
  ngOnInit(): void {
    this.customForm = this._formBuilder.group({
      formId: 0,
      name: [ ,Validators.required],
      description: ["", Validators.required],
      code: ''
    });
    this.selectedForm = this._data.form
    this.customForm.patchValue(this.selectedForm, {emitEvent: false})
  }
  close(): void {
    this.matDialogRef.close();
  }
  saveForm() {
    this.selectedForm = {...this.customForm.value}
    this._formBuilderService.saveForm(this.selectedForm).subscribe()
    this.close();
  }


  deleteForm(){
    this._formBuilderService.deleteForm(this.selectedForm)
    .pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.close())
  }

}
