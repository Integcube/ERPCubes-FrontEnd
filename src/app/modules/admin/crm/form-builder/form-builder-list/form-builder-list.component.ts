import { Component, OnInit } from '@angular/core';
import { Form } from '../form-builder.type';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilderService } from '../form-builder.service';
import { EMPTY, Observable, Subject, catchError, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Team } from '../../team/team.type';

@Component({
  selector: 'app-form-builder-list',
  templateUrl: './form-builder-list.component.html',
})
export class FormBuilderListComponent implements OnInit {
  user:User
  constructor(private _matDialog:MatDialog,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _formBuilderService:FormBuilderService,
    private _userService: UserService,
    private _snackBar: MatSnackBar) 
  { 
    this._userService.user$.subscribe( user => this.user = user)
  }
  dataSource: MatTableDataSource<Form>;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  formList:Form[]=[];
  forms$: Observable<Form[]>
  param01: number
  param02: number
  isHovered: boolean[] = []
  ngOnInit(): void {
    this.forms$ = this._formBuilderService.forms$
    this._formBuilderService.forms$
    .pipe(
      takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )
    .subscribe(forms => {this.formList = forms;  this.dataSource = new MatTableDataSource(forms);})
    this.isHovered = new Array(this.formList.length).fill(false);
  }
  viewConfigurator(form:Form){
    this._router.navigate([form.formId], { relativeTo: this._activatedRoute });
  }
  createForm() {
    //const form: Form = this._formBuilderService.getFormById(-1)
    this._matDialog.open(FormDialogComponent, {
      autoFocus: false,
      data: {
        form: new Form({})
      }
    })
  }
  editForm(form:Form) {
    this._matDialog.open(FormDialogComponent, {
      autoFocus: false,
      data: {
        form: form
      }
    })
  }
  linkForm(form:Form) {
    this.param01 = this.user.tenantId
    this.param02 = form.formId
    const formLink: string = `<iframe src="http://localhost:4200/form/custom?tenantId=${this.param01}&formId=${this.param02}" style="border: none; height:100%" height="100%" width="100%" title="Custom Form: '${form.name}'"></iframe>`;
    this.copyToClipboard(formLink);
    this.openSnackBar('Form Link has been copied to Clipboard')
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Undo',{duration: 1000});
  }
  copyToClipboard(text: string) {
    // Create a new text area element
    const textarea = document.createElement('textarea');
  
    // Set the text content to the provided text
    textarea.value = text;
  
    // Set the styling to make the textarea invisible
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
  
    // Append the textarea to the document body
    document.body.appendChild(textarea);
  
    // Select the text inside the textarea
    textarea.select();
  
    try {
      // Execute the copy command using the Clipboard API
      document.execCommand('copy');
      console.log('Text has been copied to the clipboard:', text);
    } catch (err) {
      console.error('Unable to copy text to the clipboard:', err);
    } finally {
      // Remove the textarea from the document
      document.body.removeChild(textarea);
    }
  }
  updateHoverState(index: number, state: boolean) {
    this.isHovered[index] = state;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
