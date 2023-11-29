import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeadService } from '../../../lead.service';
import { TaskModel } from '../../../lead.type';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.scss']
})
export class ViewDetailComponent implements OnInit {
  viewForm:UntypedFormBuilder
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { task: TaskModel },
    private _leadService: LeadService,
    private _formBuilder: UntypedFormBuilder,
    private _matDialogRef: MatDialogRef<ViewDetailComponent>
  ) { }

  ngOnInit(): void {
  }
  closeDialog(){

  }
}
