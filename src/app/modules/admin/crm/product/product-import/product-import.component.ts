import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Product, ProductImportList, Project } from '../product.type';
import { ProductService } from '../product.service';
import { User } from 'app/core/user/user.types';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'app/core/user/user.service';
import { MatStepper } from '@angular/material/stepper';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-product-import',
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.scss']
})
export class ProductImportComponent implements OnInit {
  showColumnMapping = false;
  columnMappings: { [key: string]: string } = {};
  jsonData: any[] = [];
  mappedProducts: ProductImportList[] = [];
  productColumns: string[] = [];
  excelColumns: string[] = [];
  products: Product[] = []; 
  user: User;
  fileUploaded = false;
  isFileUploading = false;
  isSelected = false;
  hovered = false;
  displayedColumns: string[] = ['Excel Column', 'Map to', 'Map Status'];
  invalidFileMessage: string | null = null;
  isFileValid = false;

  constructor(
    private _matDialogRef: MatDialogRef<ProductImportComponent>,
    public dialog: MatDialog,
    private _productService: ProductService,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }
  @ViewChild('stepper') stepper: MatStepper;

  ngOnInit(): void {
    this.productColumns = Object.keys(new ProductImportList({}));
  }
  
  toggleSelection() {
    this.isSelected = !this.isSelected;
  }

  openColumnMappingDialog() {
    // Initialize column mappings with default values
    this.columnMappings = {};
  
    this.showColumnMapping = true;
  }

  getAllProducts() {
    this._productService.getProducts().subscribe(
      products => {
        this.products = products;
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  getColumnColor(column: string): string {
    const productColumn = this.columnMappings[column];
    return this.productColumns.includes(productColumn) ? 'green' : 'orange';
  }

  getColumnIcon(column: string): string {
    const productColumn = this.columnMappings[column];
    return this.productColumns.includes(productColumn) ? 'heroicons_outline:check-circle' : 'mat_outline:warning_amber';
  }

  onProductColumnChange(column: string, productColumn: string) {
    if(productColumn != '-1') {
      this.columnMappings[column] = productColumn;
    }
  }

  applyColumnMapping() {
    // Fetch Product and Industry data
    this._productService.getProducts().subscribe((products: Product[]) => {
      this._productService.getProjects().subscribe((projects: Project[]) => {
        // Apply column mapping to products
        const mappedProducts: ProductImportList[] = this.jsonData.map((row) => {
          const productData: ProductImportList = new ProductImportList({});
          debugger;
          // Generic column mapping
          Object.keys(this.columnMappings).forEach((excelColumn) => {
            const productColumn = this.columnMappings[excelColumn];
              if (productColumn === 'projectId') {
                // Map Product and Industry Titles to their respective IDs
                const titleToSearch = row[excelColumn];
                const matchingItem: number = projects.find((project) => project?.title === titleToSearch)?.projectId
                productData.projectId = matchingItem ? matchingItem : -1;
              } else {
                // Set the value to an empty string if the column is not present in the current row
                productData[productColumn.toLowerCase()] = row.hasOwnProperty(excelColumn) ? row[excelColumn] : '';
              }
          });
          return productData;
        });
        const c = mappedProducts.map((product) => {
          const c: any = { ...product };
      
          // Apply transformation for all fields
          Object.keys(c).forEach((field) => {
            c[field] = c[field].toString();
          });
      
          return c;
        });  
        // Save the products
        this._productService.saveBulkImportProducts(mappedProducts).subscribe(() => {
          this.closeDialog();
          this.getAllProducts();
        });
      });
  })
  }

  file: any;

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
      });
  
      // Set the jsonData property to the accumulated data from all sheets
      this.jsonData = allData;
  
      // Extract column names (headers) from the set of unique columns
      this.excelColumns = Array.from(uniqueColumns);
  
      // Automatically map columns to productColumns dropdown
      this.productColumns.forEach((productColumn) => {
        const matchingExcelColumn = this.excelColumns.find((excelColumn) =>
          excelColumn.toLowerCase().includes(productColumn.toLowerCase())
        );
  
        if (matchingExcelColumn) {
          this.columnMappings[matchingExcelColumn] = productColumn;
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