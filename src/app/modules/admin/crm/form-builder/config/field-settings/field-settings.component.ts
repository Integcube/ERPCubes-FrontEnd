import { Component, OnInit } from '@angular/core';
import { FormConfiguratorComponent } from '../../form-configurator/form-configurator.component';

@Component({
  selector: 'app-field-settings',
  templateUrl: './field-settings.component.html',
  styleUrls: ['./field-settings.component.scss']
})
export class FieldSettingsComponent implements OnInit {

  constructor(private _formConfigurator:FormConfiguratorComponent) { }

  ngOnInit(): void {
    this._formConfigurator.matDrawer.open();
  }
  closeDrawer(){

  }
}
