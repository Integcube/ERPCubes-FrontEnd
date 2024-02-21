import { ChangeDetectorRef, Component, Inject, OnInit,ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, Subject, catchError, takeUntil } from 'rxjs';
import { SettingsService } from '../settings.service';
import { AlertService } from 'app/core/alert/alert.service';

@Component({
  selector: 'chatbot-view.component',
  templateUrl: './chatbot-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatbotViewComponent implements OnInit, OnDestroy {
  viewForm:UntypedFormGroup
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isCopied = false;
  isCopiedtoken = false;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public Componetdata: any,
    private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<ChatbotViewComponent>,
    private _settingsService: SettingsService,
    private _alertService:AlertService
  ) { }
  selectedColor: string = '#E85038';
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

  ngOnInit(): void {



    this.viewForm = this._formBuilder.group({
      id:[-1],
      tenantId: [this.Componetdata.view.tenantId],
      Link: [this.Componetdata.view.Link],
      primaryColor: [this.selectedColor],
      title: ['',Validators.required],
    });

    this.GetChatBotSetting();
  }
 
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
 
  closeDialog() {
    this._matDialogRef.close()
  }

  updateColorFromHex(color: string) {
   this.viewForm.get('primaryColor').setValue(color);
  }
  saveAndClose(): void {
    this._settingsService.saveForm(this.viewForm.value).pipe(
        takeUntil(this._unsubscribeAll),
        catchError(err=>{alert(err);
        return EMPTY})).subscribe(
          data => {
            // this._matDialogRef.close();
            this._alertService.showSuccess("ChatBot Setting Saved");
          }
        );
}

GetChatBotSetting() {

  this._settingsService.getChatbotSetting().subscribe(
    
    scores => {
      debugger
      if (scores) {
        this.viewForm.patchValue({
          id: scores.id,
          primaryColor: scores.primaryColor,
          title: scores.title,
        });
      } else {
        this.viewForm.patchValue({
          id: -1,
          primaryColor: this.selectedColor,
          title: 'Chat',
        });

      }
    }
  );
}


}
