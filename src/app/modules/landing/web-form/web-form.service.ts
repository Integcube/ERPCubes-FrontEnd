import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap, catchError, EMPTY, take, map, switchMap, throwError, of } from 'rxjs';
import { FormField, Form } from './web-form.type';

@Injectable({
  providedIn: 'root'
})
export class WebFormService {

  private readonly getFormFieldsURL = `${environment.url}/Forms/allFields`
  private readonly getFormsURL = `${environment.url}/Forms/all`
  private readonly saveFormResultURL = `${environment.url}/Forms/saveResult`
  //user:User
  private _fields: BehaviorSubject < FormField[] | null > = new BehaviorSubject(null);
  private _forms: BehaviorSubject <Form[]| null> = new BehaviorSubject(null);
  private _form: BehaviorSubject <Form | null> = new BehaviorSubject(null);
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService,   ) 
  { }

  get fields$(): Observable<FormField[]> {
    return this._fields.asObservable();
  }
  get forms$(): Observable<Form[]> {
    return this._forms.asObservable();
  }
  get form$(): Observable<Form> {
    return this._form.asObservable();
  }
  getForms(queryParam01: any) {
    let data = {
      //id: this.user.id,
      tenantId: +queryParam01
    }
    return this._httpClient.post<Form[]>(this.getFormsURL, data)
    .pipe(
      tap((forms) => {
        this._forms.next(forms)
      }),
      catchError(error => { alert(error); return EMPTY })
    )
  }
  getFormById(id:number):Observable<Form> {
    return this._forms.pipe(
      take(1),
      map(forms => {
        const form = forms.find(form => form.formId === id)
        this._form.next(form)
        return form
      }),
      switchMap((form) => {
        if (!form) {
          return throwError('Could not find Form with id of ' + id + '!');
        }
        return of(form);
      })
    )
  }
  getFormFields(queryParam01: any, queryParam02: any) {
    let data = {
      //id: this.user.id,
      tenantId: +queryParam01,
      formId: +queryParam02
    }
    return this._httpClient.post<FormField[]>(this.getFormFieldsURL, data)
    .pipe(
      tap((fields) => {
        this._fields.next(fields)
      }),
      catchError(error => { alert(error); return EMPTY })
    )
  }
  saveFormResults(result: FormField[]) {
    let data = {
      //id: this.user.id,
      tenantId: 1,
      formResult: [...result]
    }
    debugger;
    console.log('Form Fields Save Request: Service', data)
    return this._httpClient.post<any[]>(this.saveFormResultURL, data)
    .pipe( 
        catchError(error => { alert(error); return EMPTY })
    ) 
  }
}
