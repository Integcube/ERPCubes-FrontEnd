import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FileManagerService } from '../file-manager.service';
import { Item } from '../file-manager.types';


@Component({
    selector       : 'file-manager-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    items: Item[]=[];
    files:Item[]=[];
    folders:Item[]=[];
    selectedFolder:Item;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fileManagerService: FileManagerService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    )
    {
    }
    uploadAvatar(fileList: FileList): void
    {
        if ( !fileList.length )
        {
            return;
        }

        // const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        // if ( !allowedTypes.includes(file.type) )
        // {
        //     return;
        // }

        // Upload the avatar
        // this._contactsService.uploadAvatar(this.contact.id, file).subscribe();
    }

    createFolder(){
    }
    ngOnInit(): void
    {
        this._fileManagerService.folder$.pipe(takeUntil(this._unsubscribeAll))
        .subscribe((item: Item) => {
            this.selectedFolder = item;
            if(this.selectedFolder != null){
                this.files = this.items.filter(item => item.type !== 'Folder');
                this.folders = this.items.filter(item => item.type == 'Folder' && item.fileId != this.selectedFolder?.fileId);
            }
           
            this._changeDetectorRef.markForCheck();
        });
        this._fileManagerService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: Item[]) => {
                this.items = items;              
                this.files = this.items.filter(item => item.type !== 'Folder');
                this.folders = this.items.filter(item => item.type == 'Folder' && item.fileId != this.selectedFolder?.fileId);
                this._changeDetectorRef.markForCheck();
            });
        this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                this.drawerMode = state.matches ? 'side' : 'over';
                this._changeDetectorRef.markForCheck();
            });
    }
    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onBackdropClicked(): void
    {
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}
