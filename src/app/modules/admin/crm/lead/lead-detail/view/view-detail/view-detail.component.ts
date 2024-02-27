import { ChangeDetectorRef, Component, Inject, OnInit,ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LeadService } from '../../../lead.service';
import { LeadCustomList, TaskModel } from '../../../lead.type';
import { EMPTY, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewDetailComponent implements OnInit, OnDestroy {
  viewForm:UntypedFormGroup
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { view: LeadCustomList },
    private _leadService: LeadService,
    private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<ViewDetailComponent>) 
  { }


  ngOnInit(): void {
    this.viewForm = this._formBuilder.group({
      listId: [this._data.view.listId, Validators.required],
      listTitle: [this._data.view.listTitle, Validators.required],
      isPublic: [this._data.view.isPublic, Validators.required]
    });
  }

  delete(){
    this._leadService.deleteCustomList(this.viewForm.value)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data=>{this.closeDialog()})
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  save(){
    this._leadService.saveCustomList(this.viewForm.value)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe( data=>{this.closeDialog()})
  }
  
  closeDialog() {
    this._matDialogRef.close()
  }
}
