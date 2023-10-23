import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-example-form',
  templateUrl: './example-form.component.html',
  styleUrls: ['./example-form.component.scss']
})
export class ExampleFormComponent implements OnInit {
  horizontalStepperForm: UntypedFormGroup;
  
  constructor(private _formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.horizontalStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
          email   : ['', [Validators.required, Validators.email]],
          country : ['', Validators.required],
          language: ['', Validators.required]
      }),
      step2: this._formBuilder.group({
          firstName: ['', Validators.required],
          lastName : ['', Validators.required],
          userName : ['', Validators.required],
          about    : ['']
      }),
      step3: this._formBuilder.group({
          byEmail          : this._formBuilder.group({
              companyNews     : [true],
              featuredProducts: [false],
              messages        : [true]
          }),
          pushNotifications: ['everything', Validators.required]
      })
  });
  }

}
