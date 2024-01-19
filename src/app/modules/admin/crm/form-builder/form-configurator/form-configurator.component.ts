import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilderService } from '../form-builder.service';
import { Form, FormField, FormFieldType } from '../form-builder.type';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-form-configurator',
  templateUrl: './form-configurator.component.html',
})
export class FormConfiguratorComponent implements OnInit, OnDestroy {
  @Output() dataEvent: EventEmitter<FormField> = new EventEmitter<FormField>();
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  FieldArray: FormField[] = []
  selectedForm: Form
  selectedField: FormField
  fieldSettingsView: boolean = false
  constructor(
    private _formBuilderService:FormBuilderService,
    private _activatedRoute: ActivatedRoute,
    private _router:Router,
    private _changeDetectorRef:ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this._formBuilderService.form$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      data => {
        this.selectedForm = { ...data };
      }
    )
    this._formBuilderService.fields$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      fields => {
        this.FieldArray = [...fields]
      }
    )
  }
  newfieldSelected(fieldType:FormFieldType) {
    console.log('Received New Fields Type in Parent:', fieldType);
    let newField: FormField = {
      formId: this.selectedForm.formId,
      fieldId: this.FieldArray.length + 1,
      fieldType: fieldType.typeId,
      fieldLabel: '',
      placeholder: '',
      values: '',
      isFixed: false,
      order: this.FieldArray.length + 1,
      displayLabel: true,
      css: ''
    }
    this.FieldArray.push(newField)
    this.selectedField = newField
    this.fieldSettingsView = true
  }
  fieldSaved(field: FormField) {
    debugger;
    const FieldArrayIndex = this.FieldArray.findIndex(id => id.fieldId == field.fieldId)
    if(FieldArrayIndex === -1) {
      this.FieldArray.push(field)
    }
    else {
      this.FieldArray[FieldArrayIndex] = field
    }
    this.fieldSettingsView = false
    console.log(this.FieldArray)
  }
  fieldRemoved(field: FormField) {
    const formFieldIndex = this.FieldArray.indexOf(field)
    if(formFieldIndex !== 1) {
      this.FieldArray.splice(formFieldIndex, 1)
      this.closrFieldSetting('add')
    }
  }
  fieldClicked(field: FormField) {
    debugger;
    this.fieldSettingsView = true
    this.selectedField = field
  }
  closrFieldSetting(tab: string) {
    this.fieldSettingsView = !this.fieldSettingsView
    // if(tab === 'add') {
    //   this.fieldSettingsView = !this.fieldSettingsView
    // }
    // else {
    //   this.fieldSettingsView = true
    // }
  }
  allFormFieldsSaved() {
    console.log('Form Fields Save Request: Parent')
    this._formBuilderService.saveFormFields(this.FieldArray).subscribe(() => {
      this._router.navigate(['../'], { relativeTo: this._activatedRoute });
    },
    (error) => {
      // Handle error appropriately, e.g., show a message or log the error
      console.error('Error saving form fields:', error);
    })
  }
  dropped(event: CdkDragDrop<FormField[]>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    event.container.data.forEach((a, index)=>a.order = index)
    this.updateFieldsOrder(event.container.data);
  }
  updateFieldsOrder(formFields: FormField[]) {

  }
  ngOnDestroy():void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
