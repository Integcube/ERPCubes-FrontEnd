import { Component } from '@angular/core';
import { switchMap, EMPTY } from 'rxjs';
import { TenantService } from './core/tenantInterceptor/tenant.service';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{

    constructor()
    {
      
    }
}
