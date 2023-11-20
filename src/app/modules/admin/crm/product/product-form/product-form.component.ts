import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../product.type';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil, catchError, EMPTY, filter } from 'rxjs';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductService } from '../product.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormComponent implements OnInit {
  @ViewChild('name') private _titleField: ElementRef;
  private productSubject = new Subject<Product>()
  product$ = this.productSubject.asObservable();
  productForm: FormGroup;
  editMode: boolean = false;
  selectedProduct: Product;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  showDeleteConfirmationDialog: boolean = false;
  private deleteConfirmationDialogRef: MatDialogRef<any>;
  get _deleteConfirmationDialogRef(): MatDialogRef<any> {
    return this.deleteConfirmationDialogRef;
  }
  constructor(
    
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _productListComponent: ProductListComponent,
    private _productService: ProductService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this._productListComponent.matDrawer.open();
    this.product$ = this._productService.product$;
    this._productService.product$.pipe(
      takeUntil(this._unsubscribeAll),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )
    .subscribe((product: Product) => {
      this._productListComponent.matDrawer.open();
      this.selectedProduct = { ...product };

      // Move the creation of productForm inside the subscription
      this.productForm = this._formBuilder.group({
        productId: [this.selectedProduct.productId, Validators.required],
        productName: [this.selectedProduct.productName],
        description: [this.selectedProduct.description],
        price: [this.selectedProduct.price],
      });

      this._changeDetectorRef.markForCheck();
    });

  }
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._productListComponent.matDrawer.close();
  }
  ngAfterViewInit(): void {
    // Listen for matDrawer opened change
    this._productListComponent.matDrawer.openedChange
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(opened => opened)
      )
      .subscribe(() => {
        // Check if _titleField is defined before accessing it
        if (this._titleField) {
          // Focus on the title element
          this._titleField.nativeElement.focus();
        }
      });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  save() {
    this.closeDrawer();
    this._productService.saveProduct(this.productForm).subscribe();
  }
  delete() {
    this.closeDrawer();
    this._productService.deleteProduct(this.selectedProduct).subscribe();
  }
}

