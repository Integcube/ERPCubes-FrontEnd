export interface FormField{
    fieldId:number;
    formId:number
    fieldLabel:string;
    fieldType:number;
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
    icon: string;
}
export class Form {
    formId: number;
    name: string;
    code: string;
    description:string;
    //createdOn: Date;
    constructor(reg) {
        this.formId = reg.formId ? reg.formId : -1
    }
}