import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Email, Lead, TaskModel } from '../../../lead.type';
import { LeadService } from '../../../lead.service';
import { EMPTY, Subject, catchError, takeUntil } from 'rxjs';

@Component({
    selector: 'app-email-detail',
    templateUrl: './email-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailDetailComponent implements OnInit, OnDestroy {
    lead: Lead
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
        public matDialogRef: MatDialogRef<EmailDetailComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: { email: Email },
        private _formBuilder: UntypedFormBuilder,
        private _leadService: LeadService,
    ) {
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    ngOnInit(): void {
        this._leadService.lead$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data =>{ this.lead = { ...data };})
        this.createForm();
    }
    createForm() {
        this.composeForm = this._formBuilder.group({
            emailId:[this._data.email.emailId, Validators.required],
            to: [this.lead.email, [Validators.required, Validators.email]],
            // cc     : ['', [Validators.email]],
            // bcc    : ['', [Validators.email]],
            subject: [this._data.email.subject],
            description: [this._data.email.description, [Validators.required]]
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
        this._leadService.saveEmail(this.composeForm.value, this.lead.leadId).pipe(
            takeUntil(this._unsubscribeAll),
            catchError(err=>{alert(err);
            return EMPTY})).subscribe(data=>this.matDialogRef.close())
    }
    close(): void {
        this.matDialogRef.close();
    }
    saveAsDraft(): void {

    }

    delete(){
        this._leadService.deleteEmail(this.composeForm.value.emailId, this.lead.leadId)
        .pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.close())
    }
    send(): void {

    }
}
