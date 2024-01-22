import { Component, OnInit } from '@angular/core';
import { Form, FormField } from 'app/modules/landing/custom-form/custom-form.type';
import { EMPTY, Observable, Subject, catchError, takeUntil } from 'rxjs';
import { CustomFormService } from './custom-form.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.scss']
})
export class CustomFormComponent implements OnInit {
  constructor(
    private _customFormService: CustomFormService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,)
  { }
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
 
  //: Observable<FormField[]>
  fieldArray: FormField[]
  formArray: Form[]
  form: Form
  param1: string;
  param2: string;
  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      this.param1 = params['tenantId'];
      this.param2 = params['formId'];
    });
    this._customFormService.getFormFields(this.param1, this.param2)
    .subscribe(fields => {
       this.fieldArray = fields
    })
    this._customFormService.getForms(this.param1)
    .subscribe(forms => {
      this.formArray = forms
      this.form = forms.find(form => form.formId === +this.param2)
    })
  }
  onMultipleSelect(event: MatSelectChange, fieldLabel: string) {
    debugger;
    let options:string = event.value.join(',')
    this.fieldArray.find(field => field.fieldLabel === fieldLabel).result = options
  }
  onCheckBoxChange(event: MatCheckboxChange, fieldLabel: string) {
    debugger;
    const field = this.fieldArray.find(field => field.fieldLabel === fieldLabel);
    if (field) {
      if (field.result != "true") {
        field.result = "true";
      } else {
        field.result = "false";
      }
    }
  }
  onDatePicked(event: MatDatepickerInputEvent<Date>, fieldLabel: string) {
    debugger;
    const field = this.fieldArray.find(field => field.fieldLabel === fieldLabel);
    if(field) {
      field.result = event.value.toString()
    }
  }
  allFormFieldsSaved() {
    this._customFormService.saveFormResults(this.fieldArray).subscribe()
  }
}