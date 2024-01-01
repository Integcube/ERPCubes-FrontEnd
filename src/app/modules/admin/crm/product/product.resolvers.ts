import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { ProductService } from './product.service';
import { Product } from './product.type';

@Injectable({
    providedIn: 'root'
})
export class ProductsResolver implements Resolve<any>{
    constructor(private _productService:ProductService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       return this._productService.getProducts();
    }
}
@Injectable({
    providedIn: 'root'
})
export class ProjectResolver implements Resolve<any>{
    constructor(private _productService:ProductService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       return this._productService.getProjects();
    }
}
@Injectable({
    providedIn: 'root'
})
export class SelectedProductResolver implements Resolve<any>
{
    constructor(
        private _router: Router,
        private _productService:ProductService)
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product>
    {
        return this._productService.getProductById(+route.paramMap.get('id'))
                   .pipe(
                       catchError((error) => {
                           console.error(error);
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');
                           this._router.navigateByUrl(parentUrl);
                           return throwError(error);
                       })
                   );
    }
}