import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, Subject, catchError, takeUntil } from 'rxjs';
import { Email, Opportunity } from '../../../opportunity.types';
import { OpportunityService } from '../../../opportunity.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
    selector: 'app-email-detail',
    templateUrl: './email-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailDetailComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public matDialogRef: MatDialogRef<EmailDetailComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: { email: Email },
        private _formBuilder: UntypedFormBuilder,
        private _opportunityService: OpportunityService ) 
    { }
    
    opportunity: Opportunity
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

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    ngOnInit(): void {
        this._opportunityService.opportunity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data =>{ this.opportunity = { ...data };})
        this.createForm();
    }
    createForm() {
        this.composeForm = this._formBuilder.group({
            emailId:[this._data.email.emailId, Validators.required],
            to: [this.opportunity.email, [Validators.required, Validators.email]],
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
        this._opportunityService.saveEmail(this.composeForm.value, this.opportunity.opportunityId).pipe(
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
        this._opportunityService.deleteEmail(this.composeForm.value.emailId, this.opportunity.opportunityId)
        .pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.close())
    }
    send(): void {

    }
}
