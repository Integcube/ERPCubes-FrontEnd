import { ChangeDetectorRef, Component, Inject, OnInit,ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
       

import { EMPTY, Subject, takeUntil } from 'rxjs';
import { FileManagerService } from '../file-manager.service';

@Component({
    selector: 'file-manager-details',
    templateUrl: './dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerDialogComponent implements OnInit, OnDestroy {
  viewForm:UntypedFormGroup
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    // @Inject(MAT_DIALOG_DATA) private _data: { view: LeadCustomList },
    // private _leadService: LeadService,
    private _formBuilder: UntypedFormBuilder,
     private _matDialogRef: MatDialogRef<FileManagerDialogComponent>,
     private _router: Router,
      private  _route: ActivatedRoute,
     private _fileManagerService: FileManagerService,
  ) { }


  ngOnInit(): void {
    this.viewForm = this._formBuilder.group({
       Title: ["", Validators.required],
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  save(){
    this._matDialogRef.close(this.viewForm.value.Title)
  }
  closeDialog() {
    this._matDialogRef.close()
  }
}
