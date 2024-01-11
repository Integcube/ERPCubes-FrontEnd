import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilderService } from '../form-builder.service';
import { Form, FormField, FormFieldType } from '../form-builder.type';
import { Subject, takeUntil } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-configurator',
  templateUrl: './form-configurator.component.html',
  styleUrls: ['./form-configurator.component.scss']
})
export class FormConfiguratorComponent implements OnInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  FieldArray: FormField[] = [];
  selectedForm: Form;

  constructor(
    private _formService:FormBuilderService,
    private _activatedRoute: ActivatedRoute,
    private _router:Router,
    private _changeDetectorRef:ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this._formService.form$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      data => {
        this.selectedForm = { ...data };
        const fixedFieldArray: FormField[] = [
          {
          formId: this.selectedForm.formId,
          fieldId: 1,
          fieldType: 1,
          fieldLabel: 'First Name',
          placeholder: 'First Name',
          values: '',
          isFixed: true,
          order: 1,
          displayLabel: true,
          css: '',
        },
        {
          formId: this.selectedForm.formId,
          fieldId: 1,
          fieldType: 1,
          fieldLabel: 'Last Name',
          placeholder: 'Last Name',
          values: '',
          isFixed: true,
          order: 1,
          displayLabel: true,
          css: '',
        },
        {
          formId: this.selectedForm.formId,
          fieldId: 1,
          fieldType: 1,
          fieldLabel: 'Email',
          placeholder: 'Email',
          values: '',
          isFixed: true,
          order: 1,
          displayLabel: true,
          css: '',
        },
      ];
      this.FieldArray = [...fixedFieldArray]
      }

    )
  }
  fieldSelect(fieldType:FormFieldType){
    debugger;
    this._router.navigate([ fieldType.typeId], { relativeTo: this._activatedRoute });
  }
  onBackdropClicked(): void {
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  ngOnDestroy():void{
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
