import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableLimitPipe } from '@fuse/pipes/table-limit/table-limit.pipe';
import { UniquePipe } from '@fuse/pipes/unique-pipe/unique.pipe';
import { CustomFilterPipe } from '@fuse/pipes/customFilter/customFilter.pipe';
import { CustomFilterPipe2 } from '@fuse/pipes/filter-pipe/filter-pipe';

@NgModule({
    declarations:[
        TableLimitPipe,
        UniquePipe,
        CustomFilterPipe,
        CustomFilterPipe2,
        
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
        CustomFilterPipe,
        CustomFilterPipe2,
    ]
})
export class SharedModule
{
}
