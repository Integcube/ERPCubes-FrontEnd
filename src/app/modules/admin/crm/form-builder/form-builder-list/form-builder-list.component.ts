import { Component, OnInit } from '@angular/core';
import { Form } from '../form-builder.type';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilderService } from '../form-builder.service';

@Component({
  selector: 'app-form-builder-list',
  templateUrl: './form-builder-list.component.html',
  styleUrls: ['./form-builder-list.component.scss']
})
export class FormBuilderListComponent implements OnInit {

  constructor(private _matDialog:MatDialog,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _fromBuilderService:FormBuilderService
    ) { }
  formList:Form[]=[];

  ngOnInit(): void {
    let form:Form={
      formId: 1,
      formName: 'Website Form',
      createdOn: new Date(),
      formCode: '',
      formDescription: ''
    }
   for(let i = 0; i<5; i++){
    this.formList.push({...form});

   }
  }
  viewConfigurator(form:Form){
    this._fromBuilderService.setSelectedForm(form);
    this._router.navigate([form.formId], { relativeTo: this._activatedRoute });
  }
  createForm() {
    this._matDialog.open(FormDialogComponent, {
      autoFocus: false,
      data: {
        form: new Form({})
      }
    })
  }
  editForm(form:Form) {
    this._matDialog.open(FormDialogComponent, {
      autoFocus: false,
      data: {
        form: form
      }
    })
  }
}
