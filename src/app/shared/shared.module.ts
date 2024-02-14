import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableLimitPipe } from '@fuse/pipes/table-limit/table-limit.pipe';
import { UniquePipe } from '@fuse/pipes/unique-pipe/unique.pipe';
import { CustomFilterPipe } from '@fuse/pipes/customFilter/customFilter.pipe';
import { CustomFilterPipe2 } from '@fuse/pipes/filter-pipe/filter-pipe';
import { BoldPipe } from '@fuse/pipes/bold/bold.pipe';
import {FilterPipe} from '@fuse/pipes/filter/filter';
import {OrderByPipe} from '@fuse/pipes/oderBy/orderBy';
import { MonthToWordPipe } from '@fuse/pipes/month-pipe/month-convert.pipe';
import { TrashComponent } from 'app/modules/admin/crm/trash/trash.component';
@NgModule({
    declarations:[
        TableLimitPipe,
        UniquePipe,
        CustomFilterPipe,
        CustomFilterPipe2,
        BoldPipe,
        MonthToWordPipe,
        FilterPipe,
        OrderByPipe,
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
        BoldPipe,
        MonthToWordPipe,
        FilterPipe,
        OrderByPipe,
    ]
})
export class SharedModule
{
}
