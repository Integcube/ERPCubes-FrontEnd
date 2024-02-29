import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { FileManagerService } from '../file-manager.service';
import { Item } from '../file-manager.types';
import { FileManagerListComponent } from '../list/list.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'file-manager-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerDetailsComponent implements OnInit, OnDestroy {
    item: Item;
    edit: boolean;
    descriptionForm: FormControl
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fileManagerListComponent: FileManagerListComponent,
        private _fileManagerService: FileManagerService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router
    ) {
    }

    editDescription() {
        this.edit = !this.edit
    }
    downloadFile(){
        this._fileManagerService.downloadFile(this.item.path).pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
            data=>{
                if(data.body.size < 100){
                  }
                  else{
                    const fileExtension = this.item.type;
                    const url = window.URL.createObjectURL(data.body);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${this.item.fileName}.${fileExtension}`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }
            }
        );
    }
    ngOnInit(): void {
        this._fileManagerListComponent.matDrawer.open();
        this._fileManagerService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {
                this._fileManagerListComponent.matDrawer.open();
                this.item = item;
                this.descriptionForm = new FormControl(this.item ? this.item.description : '');
                this.descriptionForm.valueChanges.pipe(
                    debounceTime(300),
                ).subscribe(value => {
                    this.updateDescription(value)
                });
                this._changeDetectorRef.markForCheck();
            });
    }
    updateDescription(value:string){
        this._fileManagerService.updateDescription(value, this.item.fileId).pipe(takeUntil(this._unsubscribeAll))
        .subscribe();
    }
    deleteFile() {
        this._fileManagerService.deletedItems(this.item.fileId).pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data=>{
                this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
                this.closeDrawer()});
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._fileManagerListComponent.matDrawer.close();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
