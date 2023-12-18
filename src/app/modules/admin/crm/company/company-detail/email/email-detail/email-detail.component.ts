import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, Subject, catchError, takeUntil } from 'rxjs';
import { Company, Email } from '../../../company.type';
import { CompanyService } from '../../../company.service';

@Component({
    selector: 'app-email-detail',
    templateUrl: './email-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailDetailComponent implements OnInit, OnDestroy {
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
        public matDialogRef: MatDialogRef<EmailDetailComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: { email: Email },
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
            emailId:[this._data.email.emailId, Validators.required],
            to: [this.company.email, [Validators.required, Validators.email]],
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
        this._companyService.saveEmail(this.composeForm.value, this.company.companyId).pipe(
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
    delete(){
        this._companyService.deleteEmail(this.composeForm.value.emailId, this.company.companyId)
        .pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.close())
    }
    close(): void {
        this.matDialogRef.close();
    }
}
