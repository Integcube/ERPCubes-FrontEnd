import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FormConfiguratorComponent } from './form-configurator/form-configurator.component';

@Injectable({
  providedIn: 'root',
})
export class FormConfiguratorGuard implements CanActivate {
  constructor(
    private _formConfiguratorComponent: FormConfiguratorComponent, 
    private router: Router) 
    {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this._formConfiguratorComponent.selectedForm) {
      return true;
    } else {
      // Navigate to FormBuilderListComponent if data is not available
      this.router.navigate(['/form-builder-list']);
      return false;
    }
  }
}
