import { ChangeDetectionStrategy,ViewChild, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'lead',
  templateUrl: './lead.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./lead.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadComponent implements OnInit {
  @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  drawerOpened: boolean;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(

    private _fuseMediaWatcherService: FuseMediaWatcherService

  )   {}

  ngOnInit(): void {

            // Subscribe to media query change
            this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                // Set the drawerMode and drawerOpened
                if ( matchingAliases.includes('md') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }
            });
  }

}
