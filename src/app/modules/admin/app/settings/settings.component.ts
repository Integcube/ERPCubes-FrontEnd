import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  user: User
  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,) 
  { 
    this._userService.user$.subscribe( user => this.user = user) 
  }
  messengerForm: FormGroup
  whatsappForm: FormGroup
  instagramForm: FormGroup
  tenantId: number
  ngOnInit(): void {
    this.tenantId =  this.user.tenantId
    this.messengerForm = this._formBuilder.group({
      url: `https://www.meta.com/in/subuktageenfarooqi/${this.tenantId}`,
      tenantId: 1
    })
    this.whatsappForm = this._formBuilder.group({
      url: `https://www.web.whatsapp.com/in/subuktageenfarooqi/${this.tenantId}`,
      tenantId: 1
    })
    this.instagramForm = this._formBuilder.group({
      url: `https://www.instagram.com/in/subuktageenfarooqi/${this.tenantId}`,
      tenantId: 1
    })
  }
}
