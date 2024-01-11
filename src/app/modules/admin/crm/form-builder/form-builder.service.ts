import { Injectable } from "@angular/core";
import { Form, FormField } from "./form-builder.type";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class FormBuilderService {
    private _form: BehaviorSubject<Form | null> = new BehaviorSubject(null);
    private _field: BehaviorSubject<FormField | null> = new BehaviorSubject(null);
    get form$(): Observable<Form> {
        return this._form.asObservable();
    }
    setSelectedForm(form: Form) {
        this._form.next(form)
    }
    get field$(): Observable<FormField> {
        return this._field.asObservable();
    }
    setSelectedField(field: FormField) {
        this._field.next(field)
    }
  }