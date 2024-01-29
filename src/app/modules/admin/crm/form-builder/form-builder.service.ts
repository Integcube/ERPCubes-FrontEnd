import { Injectable } from "@angular/core";
import { Form, FormField, FormFieldType } from "./form-builder.type";
import { BehaviorSubject, EMPTY, Observable, catchError, map, of, switchMap, take, tap, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { environment } from "environments/environment";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class FormBuilderService {
    private readonly getAllFieldTypes = `${environment.url}/Forms/allTypes`
    private readonly getAllFormsURL = `${environment.url}/Forms/all`
    private readonly saveFormURL = `${environment.url}/Forms/save`
    private readonly deleteFormURL = `${environment.url}/Forms/delete`
    private readonly saveFormFieldsURL = `${environment.url}/Forms/saveFields`
    private readonly getAllFormFieldsURL = `${environment.url}/Forms/allFields`
    private _forms: BehaviorSubject<Form[] | null> = new BehaviorSubject(null);
    private _form: BehaviorSubject<Form | null> = new BehaviorSubject(null);
    private _fields: BehaviorSubject<FormField[] | null> = new BehaviorSubject(null);
    private _field: BehaviorSubject<FormField | null> = new BehaviorSubject(null);
    private _fieldTypes: BehaviorSubject<FormFieldType[] | null> = new BehaviorSubject(null);
    user: User
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private snackBar: MatSnackBar)
    {
        this._userService.user$.subscribe(user => this.user = user)
    }
    get fieldTypes$(): Observable<FormFieldType[]> {
        return this._fieldTypes.asObservable();
    }
    get forms$(): Observable<Form[]> {
        return this._forms.asObservable();
    }
    get form$(): Observable<Form> {
        return this._form.asObservable();
    }
    get fields$(): Observable<FormField[]> {
        return this._fields.asObservable();
    }
    get field$(): Observable<FormField> {
        return this._field.asObservable();
    }
    getForms(): Observable<Form[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<Form[]>(this.getAllFormsURL, data)
        .pipe(
            tap(forms => {
                this._forms.next(forms)
                
            }),
            catchError(err => this.handleError(err))
        )
    }
    saveForm(form: Form): Observable<any> {
        console.log('Form Save Request: Service', form)
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            ...form
        }
        return this._httpClient.post<any>(this.saveFormURL, data)
        .pipe(
            tap(form => {
                this.getForms().subscribe()
                
            }),
            catchError(err => this.handleError(err))

        )
    }
    deleteForm(form: Form) {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            formId: form.formId
        }
        return this._httpClient.post<Form[]>(this.deleteFormURL, data)
        .pipe(
            tap(forms => {
                this.getForms().subscribe()
            })
        ),
        catchError(err => { alert(err); return EMPTY}); 
    }
    getSelectedForm(id: number): Observable<Form[]> {
        return this._forms.pipe(
            take(1),
            map((forms) => {
                const form = forms.find(form => form.formId === id) || null;
                this._form.next(form)    
                return forms;
                }
            ),
            switchMap((field) => {
                if (!field) {
                    return throwError('Could not find FormFields with FormId of ' + id + '!');
                }
                return of(field);
            })
        );
    }
    getFormFields(formId: number): Observable<FormField[]> {
        
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            formId: formId
        }
        return this._httpClient.post<FormField[]>(this.getAllFormFieldsURL, data)
            .pipe(
                tap(fields => {
                    this._fields.next(fields)
                    
                }),
                catchError(err => this.handleError(err))
            )
    }
    saveFormFields(fields: FormField[]): Observable<FormField[]> { 
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            formFields: [...fields]
        }
        console.log('Form Fields Save Request: Service', data)
        return this._httpClient.post<FormField[]>(this.saveFormFieldsURL, data)
        .pipe( 
            catchError(err => this.handleError(err))
        )        
    } 
    // getSelectedField(field: FormField) {
        
    //     this._field.next(field)
    // }
    getFieldTypes(): Observable<FormFieldType[]> {
        
        let data = {  }
        return this._httpClient.post<FormFieldType[]>(this.getAllFieldTypes, data)
        .pipe(
            tap(types => {
                this._fieldTypes.next(types)
            }),
            catchError(err => this.handleError(err))
        )
    }

    private handleError(err: HttpErrorResponse): Observable<never> {
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
          errorMessage = `An error occurred: ${err.error.message}`;
        } else {
          errorMessage = `Backend returned code ${err.status}: ${err.message}`;
        }
        this.showNotification('snackbar-success', errorMessage, 'bottom', 'center');
        return throwError(() => errorMessage);
    }
    
    showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
        duration: 2000,
        verticalPosition: placementFrom,
        horizontalPosition: placementAlign,
        panelClass: colorName,
    });
    }
}