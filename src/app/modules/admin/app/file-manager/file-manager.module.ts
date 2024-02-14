import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { FileManagerDetailsComponent } from './details/details.component';
import { FileManagerComponent } from './file-manager.component';
import { fileManagerRoutes } from './file-manager.routing';
import { FileManagerListComponent } from './list/list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FileManagerDialogComponent } from './dialog/dialog.component';


@NgModule({
    declarations: [
        FileManagerComponent,
        FileManagerDetailsComponent,
        FileManagerListComponent,
        FileManagerDialogComponent
    ],
    imports     : [
        RouterModule.forChild(fileManagerRoutes),
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        SharedModule
    ]
})
export class FileManagerModule
{
}
