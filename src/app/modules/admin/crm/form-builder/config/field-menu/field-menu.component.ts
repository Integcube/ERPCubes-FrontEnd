import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormFieldType } from '../../form-builder.type';

@Component({
  selector: 'app-field-menu',
  templateUrl: './field-menu.component.html',
  styleUrls: ['./field-menu.component.scss']
})
export class FieldMenuComponent implements OnInit {

  @Output() dataEvent: EventEmitter<FormFieldType> = new EventEmitter<FormFieldType>();
  fieldArray:FormFieldType[]=[]
  constructor() { }
  fieldSelect(fieldType:FormFieldType){
  this.dataEvent.emit(fieldType);
  }
  ngOnInit(): void {
    const field:FormFieldType = {
      typeId: 0,
      typeName: 'field'
    }
    for(let i = 0; i<10; i++){
      this.fieldArray.push({...field})
    }
  }

}
