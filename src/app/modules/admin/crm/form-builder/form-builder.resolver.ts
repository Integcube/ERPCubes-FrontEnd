import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FormBuilderService } from "./form-builder.service";
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from "@angular/router";
import { Form, FormField, FormFieldType } from "./form-builder.type";

@Injectable({
    providedIn: 'root'
})
export class FieldTypesResolver implements Resolve<any> {
    constructor(
        private _formBuilderService: FormBuilderService
    ) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FormFieldType[]> {
        return this._formBuilderService.getFieldTypes()
    }
}
@Injectable({
    providedIn: 'root'
})
export class FormsResolver implements Resolve<any> {
    constructor(
        private _formBuilderService: FormBuilderService
    ) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Form[]> {
        return this._formBuilderService.getForms()
    }
}
@Injectable({
    providedIn: 'root'
})
export class SelectedFormResolver implements Resolve<any> {
    constructor(
        private _formBuilderService: FormBuilderService
    ) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Form[]> {
        return this._formBuilderService.getSelectedForm(+route.paramMap.get('id'))
    }
}
@Injectable({
    providedIn: 'root'
})
export class FormFieldsResolver implements Resolve<any> {
    constructor(
        private _formBuilderService: FormBuilderService
    ) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FormField[]> {
        return this._formBuilderService.getFormFields(+route.paramMap.get('id'))
    }
}
@Injectable({
    providedIn: 'root'
})
export class SelectedFieldResolver implements Resolve<any> {
    constructor(
        private _formBuilderService: FormBuilderService
    ) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FormFieldType[]> {
        return //this._formBuilderService.getFieldById()
    }
}