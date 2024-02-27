import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FileManagerService } from '../file-manager.service';
import { Item } from '../file-manager.types';
import { MatDialog } from '@angular/material/dialog';
import { FileManagerDialogComponent } from '../dialog/dialog.component';


@Component({
    selector       : 'file-manager-list',
    templateUrl    : './list.component.html',
    
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
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _matDialog: MatDialog,
        private  _route: ActivatedRoute,

    )
    {
    }
    uploadAvatar(event: any): void {
    {
       const file = event?.target?.files[0];
        if (file) {
          let parentId = this._route.snapshot.paramMap.get('folderId'); 
          this._fileManagerService.saveFile(file, +parentId)
            .subscribe(response => {
            }, error => {
              console.error('Error uploading file:', error);
            });
        }
    }
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
    createFolder() {
       let pop= this._matDialog.open(FileManagerDialogComponent,{
            autoFocus:false
        });
       pop.afterClosed().subscribe((result) => {
    
        if (result ) {
            let activeroute= this._route.snapshot.paramMap.get('folderId');
         this._fileManagerService.addFolder(+activeroute, result)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe( data=>{

            })
        }
      });
      }

      
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}
