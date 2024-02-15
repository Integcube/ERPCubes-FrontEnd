export interface FormField {
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
export interface FormFieldResult extends FormField {
    result: string;
  }
export interface Form {
    formId: number;
    name: string;
    code: string;
    description:string;
}