import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableLimitPipe } from '@fuse/pipes/table-limit/table-limit.pipe';
import { UniquePipe } from '@fuse/pipes/unique-pipe/unique.pipe';

@NgModule({
    declarations:[
        TableLimitPipe,
        UniquePipe,
        
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
        TableLimitPipe,
        UniquePipe,
    ]
})
export class SharedModule
{
}
