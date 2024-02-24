import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Form, FormField, FormFieldResult } from 'app/modules/landing/web-form/web-form.type';
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
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _webFormService: WebFormService,
    private _activatedRoute: ActivatedRoute,)
  { }

  saveSuccess: boolean;
  fieldArray: FormFieldResult[]
  formArray: Form[]
  form: Form
  param1: string;
  param2: string;
  
  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      this.param1 = params['key'];
      this.param2 = params['formkey'];
    });
    debugger;
    this._webFormService.getFormFields(this.param1, this.param2)
    .subscribe(fields => {
      debugger;
      this.fieldArray = fields.map(field => ({ ...field, result: null }));

    })
    // this._webFormService.getForms(this.param1)
    // .subscribe(forms => {
    //   this.formArray = forms
    //   this.form = forms.find(form => form.formId === +this.param2)
    // })

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  applyCustomStyles(field: FormField) {
    if (!field || !field.css) {
        return null;
    }
    const css = field.css.split(';')
      .map(pair => pair.trim())
      .filter(pair => !!pair)
      .reduce((cssObject, pair) => 
        {
          const [property, value] = pair.split(':');
          if (property && value) {
              cssObject[property.trim()] = value.trim();
          }
          return cssObject;
        }, 
        {}
      );
    if (Object.keys(css).length === 0) {
        return null;
    }
    return css;
  }

  onMultipleSelect(event: MatSelectChange, fieldLabel: string) {
    let options:string = event.value.join(',');
    this.fieldArray.find(field => field.fieldLabel === fieldLabel).result = options;
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
      field.result = event.value.toString();
    }
  }
  validateNumberInput(event: KeyboardEvent) {
    // Allow: backspace, delete, tab, escape, enter, and .
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(event.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) ||
        // Allow: Ctrl+C
        (event.keyCode === 67 && (event.ctrlKey || event.metaKey)) ||
        // Allow: Ctrl+X
        (event.keyCode === 88 && (event.ctrlKey || event.metaKey)) ||
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) &&
        (event.keyCode < 96 || event.keyCode > 105)) {
        event.preventDefault();
    }
}
  allFormFieldsSaved() {
    this._webFormService.saveFormResults(this.fieldArray, this.param1).subscribe(
      () => {
        this.saveSuccess = true;
        setTimeout(() => { this.saveSuccess = false; }, 1000); // 1000 milliseconds = 1 second
        this.fieldArray = this.fieldArray.map(field => ({ ...field, result: null }));
      }
    );
  }
}