import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ViewComponent } from '../view/view.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { ChatbotViewComponent } from '../chatbot-view/chatbot-view.component.component';
export class LinkView {
    Link: string = "";
    Type: string = "";
    tenantId: number = -1;
    token: string = "";
}


@Component({
    selector       : 'settings-channel',
    templateUrl    : './channel.component.html',
    
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsChannelComponent implements OnInit
{
    accountForm: UntypedFormGroup;
    user: User;
    view: LinkView = new LinkView();
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _matDialog: MatDialog,
        private _userService: UserService
    )
    {
        this._userService.user$.subscribe( user => this.user = user) 
    }


    CopyView(Type: any): void {
        this.view.tenantId =  this.user.tenantId
        this.view.Link= `https://callbe.thequantus.com/api/Webhook/${Type}?key=${this.user.tenantGuid}`;
        this.view.token= "Wb87Q-24fs2-34343e3-42e23-re23re2"
        this.View(this.view);
      }

      CopychatBot(Type: any): void {
        this.view.tenantId =  this.user.tenantId
        this.view.Link= `<script src="https://callbe.thequantus.com/cb/cb.js?key=${this.user.tenantGuid}" defer></script>`;
       
        this._matDialog.open(ChatbotViewComponent, {
          autoFocus: false,
          data: {
            view: this.view
          }
        });
      }
      
      


    View(view:LinkView) {
        this._matDialog.open(ViewComponent, {
          autoFocus: false,
          data: {
            view: view
          }
        });
      }
    
    ngOnInit(): void
    {
        
    
    }



}
