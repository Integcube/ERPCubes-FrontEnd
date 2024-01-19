import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormFieldType } from '../../form-builder.type';
import { EMPTY, Observable, Subject, catchError, takeUntil } from 'rxjs';
import { FormBuilderService } from '../../form-builder.service';

@Component({
  selector: 'app-field-menu',
  templateUrl: './field-menu.component.html',
})
export class FieldMenuComponent implements OnInit {

  @Output() dataEvent: EventEmitter<FormFieldType> = new EventEmitter<FormFieldType>();
  fieldTypes$: Observable<FormFieldType[]> 
  fieldTypesArray:FormFieldType[]
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _formBuilderService: FormBuilderService,)
  { }
  onFieldSelected(fieldType:FormFieldType){
    console.log('Selected Field:', fieldType);
    this.dataEvent.emit(fieldType);
  }
  ngOnInit(): void {
    this.fieldTypes$ = this._formBuilderService.fieldTypes$
    this._formBuilderService.fieldTypes$
    .pipe(
      takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )
    .subscribe((types: FormFieldType[]) => {
      this.fieldTypesArray = types
    })
  }

}
