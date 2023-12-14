import { Component, OnDestroy, OnInit,Inject, ChangeDetectionStrategy } from '@angular/core';
import { EMPTY, Subject, catchError, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Call, Company } from '../../../company.type';
import { CompanyService } from '../../../company.service';

@Component({
  selector: 'app-call-detail',
  templateUrl: './call-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallDetailComponent implements OnInit , OnDestroy {
  company: Company
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  composeForm: UntypedFormGroup;
  copyFields: { cc: boolean; bcc: boolean } = {
      cc: false,
      bcc: false
  };
  quillModules: any = {
      toolbar: [
          ['bold', 'italic', 'underline'],
          [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
          ['clean']
      ]
  };

  constructor(
      public matDialogRef: MatDialogRef<CallDetailComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: { call: Call },
      private _formBuilder: UntypedFormBuilder,
      private _companyService: CompanyService,
  ) {
  }
  ngOnDestroy(): void {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }
  ngOnInit(): void {
      this._companyService.company$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data =>{ this.company = { ...data }; this.createForm()})

  }
  createForm() {
      this.composeForm = this._formBuilder.group({
          callId:[this._data.call.callId, Validators.required],
          // to: [this.lead.firstName, [Validators.required, Validators.email]],
          // cc     : ['', [Validators.email]],
          // bcc    : ['', [Validators.email]],
          subject: [this._data.call.subject],
          response: [this._data.call.response, [Validators.required]],
          startTime: [this._data.call.startTime],
          endTime: [this._data.call.endTime]
      });
  }
  // showCopyField(name: string): void
  // {
  //     if ( name !== 'cc' && name !== 'bcc' )
  //     {
  //         return;
  //     }

  //     this.copyFields[name] = true;
  // }

  saveAndClose(): void {
      this._companyService.saveCall(this.composeForm.value, this.company.companyId).pipe(
          takeUntil(this._unsubscribeAll),
          catchError(err=>{alert(err);
          return EMPTY})).subscribe(data=>this.matDialogRef.close())
  }
  discard(): void {
      this.matDialogRef.close();
  }
  saveAsDraft(): void {

  }
  send(): void {

  }
}
