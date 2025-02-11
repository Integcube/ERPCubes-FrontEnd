import { ChangeDetectorRef, Component, Inject, OnInit,ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit, OnDestroy {
  viewForm:UntypedFormGroup
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isCopied = false;
  isCopiedtoken = false;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public Componetdata: any,
    private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<ViewComponent>
  ) { }

  copyToClipboard(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 1000);
  }
  copyToClipboardtoken(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    this.isCopiedtoken = true;
    setTimeout(() => {
      this.isCopiedtoken = false;
    }, 1000);
  }
  

  ngOnInit(): void {
    this.viewForm = this._formBuilder.group({
      tenantId: [this.Componetdata.view.tenantId],
      Link: [this.Componetdata.view.Link],
      token: [this.Componetdata.view.token],
    });
  }
 
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
 
  closeDialog() {
    this._matDialogRef.close()
  }
}
