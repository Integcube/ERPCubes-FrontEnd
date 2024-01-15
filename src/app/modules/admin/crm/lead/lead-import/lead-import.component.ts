import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SocialAuthService, FacebookLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { MatStepper } from '@angular/material/stepper';
// import { AdsService } from '../ads.service';
// import { SelectAdAccountComponent } from '../select-ad-account/select-ad-account.component';
import { EMPTY, Subject, catchError } from 'rxjs';
// import { AdAccountList, AdList, LeadList, Product } from '../ads.type';
import { filter } from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadService } from '../lead.service';
import { HttpEventType, HttpResponse } from '@angular/common/http'; // Import necessary modules
import * as XLSX from 'xlsx';
import { Lead } from '../lead.type';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
@Component({
  selector: 'app-lead-import',
  templateUrl: './lead-import.component.html',
  styleUrls: ['./lead-import.component.scss'],
})
export class LeadImportComponent implements OnInit {
  showColumnMapping = false;
  columnMappings: { [key: string]: string } = {};
  jsonData: any[] = [];
  mappedLeads: Lead[] = [];
  leadColumns: string[] = [];
  excelColumns: string[] = [];
  leads: Lead[] = []; 
  user: User;
  fileUploaded = false;
  isFileUploading = false;
  isSelected = false;
  hovered = false;
  displayedColumns: string[] = ['Excel Column', 'Map to', 'Map Status'];
  invalidFileMessage: string | null = null;
  isFileValid = false;
  constructor(
    private _matDialogRef: MatDialogRef<LeadImportComponent>,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private leadService: LeadService,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }
  @ViewChild('stepper') stepper: MatStepper;

  ngOnInit(): void {
    // Initialization logic here if needed
    this._userService.user$.subscribe(user => {
      this.user = user;
      this.getAllLeads(); // Fetch leads when the user changes
    });
    this.leadColumns = Object.keys(new Lead({}));
  }


  toggleSelection() {
    this.isSelected = !this.isSelected;
  }
  openColumnMappingDialog() {
    // Initialize column mappings with default values
    this.columnMappings = {};
  
    this.showColumnMapping = true;
  }
  getAllLeads() {
    this.leadService.getLeads().subscribe(
      leads => {
        this.leads = leads;
      },
      error => {
        console.error('Error fetching leads:', error);
      }
    );
  }

  getColumnColor(column: string): string {
    // Check if the column is mapped to a valid value
    const leadColumn = this.columnMappings[column];
    return this.leadColumns.includes(leadColumn) ? 'green' : 'orange';
  }
  getColumnIcon(column: string): string {
    // Check if the column is mapped to a valid value
    const leadColumn = this.columnMappings[column];
    return this.leadColumns.includes(leadColumn) ? 'heroicons_outline:check-circle' : 'mat_outline:warning_amber';
  }
  // Event handler for dropdown selection change
  onLeadColumnChange(column: string, leadColumn: string) {
    this.columnMappings[column] = leadColumn;
  }

  applyColumnMapping() {
    // Apply column mapping to leads
    const mappedLeads: Lead[] = this.jsonData.map((row) => {
      const leadData: Lead = new Lead({});
  
      // Handle specific mapping for firstName and lastName
      leadData.firstName = row['First Name'] || '';  
      leadData.lastName = row['Last Name'] || ''; 
  
      // Generic column mapping
      Object.keys(this.columnMappings).forEach((excelColumn) => {
        const leadColumn = this.columnMappings[excelColumn];
  
        // Skip "name" since it's already mapped to "firstName" and "lastName"
        if (excelColumn !== 'First Name' && excelColumn !== 'Last Name') {
          // Set the value to an empty string if the column is not present in the current row
          if (leadColumn.toLowerCase() === 'lastname') {
            leadData.lastName = row.hasOwnProperty(excelColumn) ? row[excelColumn] : '';
          } else {
            leadData[leadColumn.toLowerCase()] = row.hasOwnProperty(excelColumn) ? row[excelColumn] : '';
          }
        }
      });
  
      return leadData;
    });
  
    // Log the mapped leads to the console
    console.log('Mapped Leads:', mappedLeads);
  
    // Optionally, you can assign the mapped leads to a class property for further use
    this.mappedLeads = mappedLeads;
  
    // Close the mapping dialog
    this.showColumnMapping = false;

    this.leadService.saveBulkLeads(this.mappedLeads).subscribe(() => {
      this.closeDialog();
      this.getAllLeads(); 
    });
  }
  
  

  file:any;

  closeDialog() {
    this._matDialogRef.close();
  }

  moveStepperToPreviousStep(): void {
    if (this.stepper.selectedIndex > 0) {
      this.stepper.previous();
    }
  }
  moveStepperToNextStep(): void {
    if (this.stepper.selectedIndex < this.stepper.steps.length - 1) {
      if (this.stepper.selectedIndex === 0 && !this.isSelected) {
        // If on the first step and file not uploaded, upload the file before moving to the next step
        this.toggleSelection();
      } else if (this.stepper.selectedIndex === 1 && !this.fileUploaded) {
        this.uploadFile();
      } else {
        // Directly call openColumnMappingDialog if the file is uploaded
        if (this.fileUploaded) {
          this.openColumnMappingDialog();
          // Set the stepper's selectedIndex to the next step
          this.stepper.selectedIndex = Number(this.stepper.selectedIndex) + 1;
        } else {
          this.stepper.next();
        }
      }
    }
  }
  
  selectFile(event) {
    this.file = event.target.files[0];
  
    if (!this.file) {
      console.error('No file selected');
      this.isFileValid = false;
      return;
    }
  
    const allowedFileExtensions = ['.xlsx', '.xls'];
    const fileExtension = this.file.name.toLowerCase();
  
    if (!allowedFileExtensions.some(ext => fileExtension.endsWith(ext))) {
      // Set the error message for invalid file type
      this.invalidFileMessage = 'Invalid file type. Please upload a valid Excel file.';
      this.isFileValid = false;
    } else {
      this.invalidFileMessage = null; // Clear the error message
      this.isFileValid = true; // File is valid
    }
  
    this.fileUploaded = false;
  }
  

  uploadFile() {
    if (!this.file) {
      console.error('No file selected');
      return;
    }
    // const allowedFileExtensions = ['.xlsx', '.xls'];
    // const fileExtension = this.file.name.toLowerCase();
  
    // if (!allowedFileExtensions.some(ext => fileExtension.endsWith(ext))) {
    //   // Set the error message for invalid file type
    //   this.invalidFileMessage = 'Invalid file type. Please upload a valid Excel file.';
    //   return;
    // }
    const fileReader = new FileReader();
  
    fileReader.onload = (e) => {
      const arrayBuffer: any = fileReader.result;
      const data = new Uint8Array(arrayBuffer);
      const arr = [];
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
  
      // Initialize an array to store data from all sheets
      const allData = [];
  
      // Initialize a Set to store unique column names
      const uniqueColumns = new Set<string>();
  
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
  
        // Convert each worksheet to JSON format
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
  
        // Add the sheet data to the array
        allData.push(...sheetData);
  
        // Extract column names from the first row of the sheet data and add to the set
        if (sheetData.length > 0) {
          Object.keys(sheetData[0]).forEach((column) => {
            uniqueColumns.add(column);
          });
        }
      });
  
      // Set the jsonData property to the accumulated data from all sheets
      this.jsonData = allData;
  
      // Extract column names (headers) from the set of unique columns
      this.excelColumns = Array.from(uniqueColumns);
  
      console.log('Loaded Excel Data:', this.jsonData);
  
      this.invalidFileMessage = null; // Clear the error message
      this.fileUploaded = true;
      this.moveStepperToNextStep();
    };
  
    fileReader.readAsArrayBuffer(this.file);
  }
  
  // save(){
  //   this.leadService.saveBulkLeads(this.mappedLeads).subscribe(() => {
  //     this.closeDialog();
  //     this.getAllLeads(); 
  //   });
  // }

}
