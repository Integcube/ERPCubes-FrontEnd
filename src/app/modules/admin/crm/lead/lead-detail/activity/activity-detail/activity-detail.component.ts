import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Activity } from 'app/modules/admin/app/activity/activities.types';
import moment from 'moment';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { LeadService } from '../../../lead.service';
import { Lead } from '../../../lead.type';
@Component({
    selector: 'app-activity-detail',
    templateUrl: './activity-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityDetailComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    counter = 1;
    lead: Lead;
    activitiesz$: Observable<Activity[]> = combineLatest(this._leadService.activities$, this._leadService.users$)
        .pipe(map(([activities, users]) => {
            if (activities) {
                return activities.map(activity => ({
                    ...activity,
                    userName: users.find(u => u.id == activity.createdBy)?.name // Access the username property from the user
                } as Activity))
            }
        }
        ));
    constructor(public _leadService: LeadService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) { }
    ngOnInit(): void {
        this._leadService.lead$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            this.lead = { ...data }; this.getActivity();
        })
    }
    // loadMoreEntries(event: Event): void {
    //     const scrollPosition = window.pageYOffset;
    //     const windowSize = window.innerHeight;
    //     const documentSize = document.body.offsetHeight;
    //     if (scrollPosition + windowSize >= documentSize - 20) {
    //         this.getActivity();
    //     }
    // }
    getActivity() {
        this._leadService.getActivities(this.counter, this.lead.leadId).pipe(takeUntil(this._unsubscribeAll)).subscribe((newEntries) => {
            this.counter++;
            this._changeDetectorRef.markForCheck();
        });
    }
    isSameDay(current: string, compare: string): boolean {
        return moment(current, moment.ISO_8601).isSame(moment(compare, moment.ISO_8601), 'day');
    }
    getRelativeFormat(createdDate: string): string {
        const today = moment().startOf('day');
        const yesterday = moment().subtract(1, 'day').startOf('day');
        if (moment(createdDate, moment.ISO_8601).isSame(today, 'day')) {
            return 'Today';
        }
        if (moment(createdDate, moment.ISO_8601).isSame(yesterday, 'day')) {
            return 'Yesterday';
        }
        return moment(createdDate, moment.ISO_8601).fromNow();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
