import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableLimitPipe } from '@fuse/pipes/table-limit/table-limit.pipe';

@NgModule({
    declarations:[
        TableLimitPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableLimitPipe
    ]
})
export class SharedModule
{
}
