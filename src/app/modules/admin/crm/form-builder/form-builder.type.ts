export interface FormField{
    formId:number
    fieldId:number;
    fieldType:number;
    fieldLabel:string;
    placeholder:string;
    values:string;
    isFixed:boolean;
    order:number;
    displayLabel:boolean;
    css:string;
}
export interface FormFieldType{
    typeId:number;
    typeName:string;
}
export class Form {
    formId: number;
    formName: string;
    formCode: string;
    formDescription:string;
    createdOn: Date;
    constructor(reg) {
        this.formId = reg.formId ? reg.formId : -1
    }
}