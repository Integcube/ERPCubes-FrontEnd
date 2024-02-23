import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { Product, ProductImportList, Project } from './product.type';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from 'app/core/alert/alert.service';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly getproductListURL = `${environment.url}/Product/all`
  private readonly saveProductURL = `${environment.url}/Product/save`
  private readonly deleteProductURL = `${environment.url}/Product/delete`
  private readonly getProjectURL = `${environment.url}/Project/all`
  private readonly saveBulkProductsURL = `${environment.url}/Product/bulkSave`
  private readonly getDeletedProductList = `${environment.url}/Product/del`
  private readonly getRestoreBulkProductList = `${environment.url}/Product/restoreBulk`
  private readonly getRestoreProductList = `${environment.url}/Product/restore`


  user: User;
  private _product: BehaviorSubject<Product | null> = new BehaviorSubject(null);
  private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(null);
  private _projects: BehaviorSubject<Project[] | null> = new BehaviorSubject(null);
  constructor(
    private _userService: UserService,
    private _alertService: AlertService,
    private _httpClient: HttpClient,
    private snackBar: MatSnackBar) 
  {
    this._userService.user$.subscribe(user => {this.user = user;})
  }
  get product$(): Observable<Product> {
    return this._product.asObservable();
  }
  get products$(): Observable<Product[]> {
    return this._products.asObservable();
  }
  get projects$(): Observable<Project[]> {
    return this._projects.asObservable();
  }

  getProducts(): Observable<Product[]> {
    
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Product[]>(this.getproductListURL, data).pipe(
      tap((products) => {
        this._products.next(products);
      }),
      
    );
  }

  getProjects(): Observable<Project[]> {
    
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Project[]>(this.getProjectURL, data).pipe(
      tap((projects) => {
        this._projects.next(projects);
      }),
      
    );
  }

  saveProduct(product:FormGroup){
    
    let data : Product= {
      id:this.user.id,
      tenantId: this.user.tenantId,
      ...product.value
    }
    return this._httpClient.post<Product[]>(this.saveProductURL, data).pipe(
      tap((products) => {
        this._alertService.showSuccess("Product Saved Successfully");
        this.getProducts().subscribe();
      }),
      
    );
  }

  saveBulkImportProducts(products: ProductImportList[]){
    const data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      products: products
    };
    debugger;
    return this._httpClient.post<any>(this.saveBulkProductsURL, data).pipe(
      tap(data => {
      })
    );
  }
  
  deleteProduct(product:Product){
    
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      ...product
    }
    return this._httpClient.post<Product[]>(this.deleteProductURL, data).pipe(
      tap((products) => {
        this.getProducts().subscribe();
      }),
      
    );
  }

  selectedProduct(selectedProduct: Product) {
    this._product.next(selectedProduct);
  }

  getProductById(id: number): Observable<Product> {
    
    return this._products.pipe(
      take(1),
      map((products) => {
        if (id === -1) {
          
          const product = new Product({});
          this._product.next(product);
          return product;
        }
        else {
           
          const product = products.find(item => item.productId === id) || null;
          this._product.next(product);
          return product;
        }
      }),
      switchMap((product) => {
        if (!product) {
          return throwError('Could not found task with id of ' + id + '!');
        }
        return of(product);
      })
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    this.showNotification('snackbar-success', errorMessage, 'bottom', 'center');
    return throwError(() => errorMessage);
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }  

  getDeletedProducts(): Observable<Product[]> {
    
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Product[]>(this.getDeletedProductList, data).pipe(
      tap((products) => {
        this._products.next(products);
      }),
      
    );
  }


  restoreProduct(product: Product): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      productId: product.productId
    };

    return this._httpClient.post<Product[]>(this.getRestoreProductList, data).pipe(
      tap(() => {
        this.showNotification('snackbar-success', 'Product restored successfully', 'bottom', 'center');
        this.getDeletedProducts().subscribe();
      }),
      
    );
  }

  restoreBulkProduct(productIds: number[]): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      productId: productIds
    };
  
    return this._httpClient.post<Product[]>(this.getRestoreBulkProductList, data).pipe(
      tap(() => {
        this.showNotification('snackbar-success', 'Products restored successfully', 'bottom', 'center');
        this.getDeletedProducts().subscribe();
      }),
      
    );
  }


}
