import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormField } from '../../form-builder.type';
import { FormGroup, FormArray, FormBuilder, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-field-settings',
  templateUrl: './field-settings.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldSettingsComponent implements OnInit {
  @Input() selectedField: FormField | undefined;
  @Output() dataEvent: EventEmitter<FormField> = new EventEmitter<FormField>();
  form: FormGroup;
  options: string[] = []
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  get optionControls() {
    return (this.form.get('options') as FormArray).controls;
  }
  constructor(private fb: FormBuilder) 
  {  }
  ngOnInit(): void {
    if((this.selectedField.fieldType == 5 || this.selectedField.fieldType == 6 || this.selectedField.fieldType == 7) && this.selectedField.values){
      this.options = this.selectedField.values.split(',')
    }
    else if((this.selectedField.fieldType == 5 || this.selectedField.fieldType == 6 || this.selectedField.fieldType == 7) && !this.selectedField.values){
      this.options = ['']
    }
    else{this.options = null}
  }
  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
 
  onFieldPropertyChange(changedField:FormField): void {
    // Emit the updated selectedField object
    this.selectedField.values = this.options.join(',');
    this.dataEvent.emit(this.selectedField);
  }
  addOption() {
    this.options.push('');
  }

  removeOption(option: string) {
    const optionIndex = this.options.indexOf(option);
    if (optionIndex !== -1) {
      this.options.splice(optionIndex, 1);
    }
  }
  trackByFn(index: number, item: any): any {
    return index;
  }
  
}
