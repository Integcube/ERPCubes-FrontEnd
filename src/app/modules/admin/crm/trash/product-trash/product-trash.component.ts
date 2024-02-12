import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subject, combineLatest, debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { DeletedProducts } from '../trash.type';
import { TrashService } from '../trash.service';
import { Product } from '../../product/product.type';
import { ProductService } from '../../product/product.service';


@Component({
  selector: 'app-product-trash',
  templateUrl: './product-trash.component.html',
  styleUrls: ['./product-trash.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTrashComponent implements OnInit {
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  dataSource: MatTableDataSource<DeletedProducts>;
  dataSourceProd: MatTableDataSource<Product>;
  selection = new SelectionModel<DeletedProducts>(true, []);
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  products: DeletedProducts[];
  deletedUsers: string[] = [];

  allProducts: Product[];
  // displayedColumns: string[] = ['Product Name', 'Restore', 'Created By'];
  deletedProducts$: Observable<DeletedProducts[]>;
  constructor(
    private _productService: TrashService,
    private _allProductService: ProductService,
    private _matDialogRef: MatDialogRef<ProductTrashComponent>,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  getDeletedFilters(): void {
    this._productService.getDeletedProducts().subscribe((products: DeletedProducts[]) => {
      this.deletedUsers = Array.from(new Set(products.map(product => product.deletedBy)));
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnInit(): void {
    this.deletedProducts$ = this._productService.getDeletedProducts();
    this.getDeletedFilters();
    this._productService.deletedTrashProducts$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((products: DeletedProducts[]) => {
        this.products = [...products];
        this.dataSource = new MatTableDataSource(this.products);
        this._changeDetectorRef.markForCheck();
      });

    this.searchInputControl.valueChanges
      .pipe(
        debounceTime(300), // Adjust debounce time as needed
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(searchTerm => {
        this.deletedProducts$ = this._productService.getDeletedProducts().pipe(
          map(products => products.filter(product =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        );

        this._changeDetectorRef.markForCheck();
      });
  }

  restoreProduct(product: DeletedProducts): void {
    this._productService.restoreProduct(product).subscribe(() => {
      this.deletedProducts$ = this._productService.getDeletedProducts();
      this._changeDetectorRef.markForCheck();
    });
  }


  // Update restoreBulkProduct method
  restoreBulkProduct(): void {
    if (this.isAnyProductSelected()) {
      const selectedProductIds = this.selectedProducts.map(product => product.productId);

      this._productService.restoreBulkProduct(selectedProductIds).subscribe(() => {
        this.deletedProducts$ = this._productService.getDeletedProducts();

        this._productService.getDeletedProducts().subscribe((products: DeletedProducts[]) => {
          this.dataSource.data = products;
          this.selectedProducts = [];
          this._changeDetectorRef.markForCheck();
        });
      });

    }
  }



  selectedProducts: DeletedProducts[] = [];

  toggleSelection(event: MatCheckboxChange, product: DeletedProducts): void {
    if (event.checked) {
      this.selectedProducts.push(product);
    } else {
      this.selectedProducts = this.selectedProducts.filter(selectedProduct => selectedProduct !== product);
    }
  }



  isAnyProductSelected(): boolean {
    return this.selectedProducts.length > 0;
  }



  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  closeDialog() {
    this._matDialogRef.close();

    this._allProductService.getProducts().subscribe((allProducts: Product[]) => {
      this.allProducts = [...allProducts];
      this.dataSourceProd = new MatTableDataSource(this.allProducts);
      this._changeDetectorRef.markForCheck();
    });
  }



  filterByUser(user: string): void {
    if (user === 'All Users') {
      this.deletedProducts$ = this._productService.getDeletedProducts();
    } else {
      this.deletedProducts$ = this._productService.getDeletedProducts().pipe(
        map(products => products.filter(product => product.deletedBy === user))
      );
    }
    this._changeDetectorRef.markForCheck();
  }

}