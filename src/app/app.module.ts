import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GridsterModule } from 'angular-gridster2';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        GridsterModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        FullCalendarModule,
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),
        CoreModule,
        LayoutModule,
        MarkdownModule.forRoot({})
    ],

    bootstrap: [
        AppComponent
    ],
    providers: [
        {
          provide: MAT_DATE_FORMATS,
          useValue: {
            parse: {
              dateInput: (value: any) => {
                const momentDate = moment.utc(value, 'YYYY-MM-DD', true);
                return momentDate.isValid() ? momentDate.toDate() : null;
              },
              strict: true
            },
            display: {
              dateInput: 'll',
              monthYearLabel: 'MMM YYYY',
              dateA11yLabel: 'LL',
              monthYearA11yLabel: 'MMMM YYYY'
            }
          }
        },
        // Add this provider to prevent date conversion issues
        {
          provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
          useValue: { useUtc: true }
        }
      ]
})
export class AppModule {
}
