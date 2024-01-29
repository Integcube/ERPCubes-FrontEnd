import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { LeadService } from '../lead.service';
import * as XLSX from 'xlsx';
import { Industry, Lead, LeadImportList, LeadSource, Product } from '../lead.type';
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
  mappedLeads: LeadImportList[] = [];
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
    this.leadColumns = Object.keys(new LeadImportList({}));

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
    const leadColumn = this.columnMappings[column];
    return this.leadColumns.includes(leadColumn) ? 'green' : 'orange';
  }
  getColumnIcon(column: string): string {
    const leadColumn = this.columnMappings[column];
    return this.leadColumns.includes(leadColumn) ? 'heroicons_outline:check-circle' : 'mat_outline:warning_amber';
  }
  onLeadColumnChange(column: string, leadColumn: string) {
    this.columnMappings[column] = leadColumn;
  }

  applyColumnMapping() {
    // Fetch Product and Industry data
    this.leadService.getProduct().subscribe((products: Product[]) => {
      this.leadService.getIndustries().subscribe((industries: Industry[]) => {
        // Apply column mapping to leads
        const mappedLeads: LeadImportList[] = this.jsonData.map((row) => {
          const leadData: LeadImportList = new LeadImportList({});
  
          // Handle specific mapping for firstName and lastName
          leadData.firstName = row['First Name'] || '';
          leadData.lastName = row['Last Name'] || '';
  
          // Generic column mapping
          Object.keys(this.columnMappings).forEach((excelColumn) => {
            const leadColumn = this.columnMappings[excelColumn];
  
            if (excelColumn !== 'First Name' && excelColumn !== 'Last Name') {
              if (leadColumn.toLowerCase() === 'producttitle' || leadColumn.toLowerCase() === 'industrytitle') {
                // Map Product and Industry Titles to their respective IDs
                const titleToSearch = row[excelColumn];
                const idField = leadColumn.toLowerCase() === 'producttitle' ? 'productId' : 'industryId';
                const matchingItem = leadColumn.toLowerCase() === 'producttitle'
                  ? products.find((product) => product.productName === titleToSearch)
                  : industries.find((industry) => industry.industryTitle === titleToSearch);
  
                leadData[idField] = matchingItem ? matchingItem[idField] : null;
              } else {
                // Set the value to an empty string if the column is not present in the current row
                leadData[leadColumn.toLowerCase()] = row.hasOwnProperty(excelColumn) ? row[excelColumn] : '';
              }
            }
          });
  
          return leadData;
        });
        const c = mappedLeads.map((lead) => {
          const c: any = { ...lead };
      
          // Apply transformation for all fields
          Object.keys(c).forEach((field) => {
            c[field] = c[field].toString();
          });
      
          return c;
        });  
        // Save the leads
        this.leadService.saveBulkImportLeads(mappedLeads).subscribe(() => {
          this.closeDialog();
          this.getAllLeads();
        });
      });
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
            // Check if the column is not empty
            if (column.trim() !== '') {
              uniqueColumns.add(column);
            }
          });
        }
  
        // Automatically map "Name" column to "FirstName" and "LastName"
        if (uniqueColumns.has('Name') && !this.columnMappings['Name']) {
          this.columnMappings['Name'] = 'Name'; // Map "Name" to itself initially
  
          const nameColumnIndex = this.excelColumns.indexOf('Name');
          sheetData.forEach((row) => {
            const nameValue = row['Name'];
  
            if (nameValue && nameValue.includes(' ')) {
              // If "Name" contains a space, assume it's a combination of first name and last name
              const [firstName, lastName] = nameValue.split(' ', 2);
  
              // Map to lead columns
              this.columnMappings['Name'] = ''; // Clear previous mapping
              this.columnMappings[firstName.trim()] = 'FirstName';
              this.columnMappings[lastName.trim()] = 'LastName';
            }
          });
        }
      });
  
      // Set the jsonData property to the accumulated data from all sheets
      this.jsonData = allData;
  
      // Extract column names (headers) from the set of unique columns
      this.excelColumns = Array.from(uniqueColumns);
  
      // Automatically map columns to leadColumns dropdown
      this.leadColumns.forEach((leadColumn) => {
        const matchingExcelColumn = this.excelColumns.find((excelColumn) =>
          excelColumn.toLowerCase().includes(leadColumn.toLowerCase())
        );
  
        if (matchingExcelColumn) {
          this.columnMappings[matchingExcelColumn] = leadColumn;
        }
      });
  
      console.log('Loaded Excel Data:', this.jsonData);
  
      this.invalidFileMessage = null; // Clear the error message
      this.fileUploaded = true;
      this.moveStepperToNextStep();
    };
  
    fileReader.readAsArrayBuffer(this.file);
  }
}
