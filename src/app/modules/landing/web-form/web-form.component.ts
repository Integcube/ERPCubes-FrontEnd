import { Component, OnInit } from '@angular/core';
import { Form, FormField } from 'app/modules/landing/web-form/web-form.type';
import { EMPTY, Observable, Subject, catchError, takeUntil } from 'rxjs';
import { WebFormService } from './web-form.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
@Component({
  selector: 'app-web-form',
  templateUrl: './web-form.component.html',
  styleUrls: ['./web-form.component.scss']
})
export class WebFormComponent implements OnInit {
  constructor(
    private _webFormService: WebFormService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,)
  { }
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

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
    this._webFormService.getFormFields(this.param1, this.param2)
    .subscribe(fields => {
       this.fieldArray = fields
    })
    this._webFormService.getForms(this.param1)
    .subscribe(forms => {
      this.formArray = forms
      this.form = forms.find(form => form.formId === +this.param2)
    })
  }

  onMultipleSelect(event: MatSelectChange, fieldLabel: string) {
    let options:string = event.value.join(',')
    this.fieldArray.find(field => field.fieldLabel === fieldLabel).result = options
  }

  onCheckBoxChange(event: MatCheckboxChange, fieldLabel: string) {
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
    const field = this.fieldArray.find(field => field.fieldLabel === fieldLabel);
    if(field) {
      field.result = event.value.toString()
    }
  }

  allFormFieldsSaved() {
    this._webFormService.saveFormResults(this.fieldArray).subscribe()
  }
}