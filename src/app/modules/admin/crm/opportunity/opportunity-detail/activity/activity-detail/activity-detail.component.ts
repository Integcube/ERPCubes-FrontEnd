import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Activity } from 'app/modules/admin/app/activity/activities.types';
import moment from 'moment';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { Opportunity } from '../../../opportunity.types';
import { OpportunityService } from '../../../opportunity.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
    selector: 'app-activity-detail',
    templateUrl: './activity-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityDetailComponent implements OnInit, OnDestroy {
    user: User
    constructor(public _opportunityService: OpportunityService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService,
        private _sanitizer: DomSanitizer
    )
    {
        this._userService.user$.subscribe(user =>
            this.user = user)
    }
    @HostListener('window:scroll', ['$event'])
    loadingMore = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    counter = 1;
    opportunity: Opportunity;
    activitiesz$: Observable<Activity[]> = combineLatest(this._opportunityService.activities$, this._opportunityService.users$)
        .pipe(map(([activities, users]) => {
            if (activities) {
                return activities.map(activity => ({
                    ...activity,
                    userName: users.find(u => u.id == activity.userId)?.name // Access the username property from the user
                } as Activity))
            }
        }
        ));
    ngOnInit(): void {
        this._opportunityService.opportunity$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            this.opportunity = { ...data }; this.getActivity();
        })
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getActivity() {
        this.loadingMore = true;
        this._opportunityService.getActivities(this.counter, this.opportunity.opportunityId).pipe(takeUntil(this._unsubscribeAll)).subscribe((newEntries) => {
            this.counter++;
            this.loadingMore = false;
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
    sanitizeHtml(htmlString: string): SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(htmlString);
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    onScroll(): void {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.body.scrollHeight;
        if (scrollPosition >= documentHeight - 1 && !this.loadingMore) {
            setTimeout(() => {
                this.getActivity();
            }, 500);
        }
    }
}
