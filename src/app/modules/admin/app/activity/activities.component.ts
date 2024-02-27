import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { ActivitiesService } from './activities.service';
import { Activity } from './activities.types';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'activity',
    templateUrl: './activities.component.html',
    styleUrls:['./activities.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesComponent implements OnInit {
    activities$: Observable<Activity[]>;
    activities: Activity[]
    private _unsubscribeAll: Subject<any> = new Subject<any>;
    counter = 2;
    loadingMore = false;
    @HostListener('window:scroll', ['$event'])
    onScroll(): void {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.body.scrollHeight;
        if (scrollPosition >= documentHeight - 1 && !this.loadingMore) {
            setTimeout(() => {
                this.getActivity();
            }, 500);
        }
    }
    user: User;
    constructor(
        public _activityService: ActivitiesService,
        public _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _sanitizer: DomSanitizer
        ) 
    {
        this._userService.user$.subscribe(user => {
            this.user = user;
        })
    }
    activitiesz$: Observable<Activity[]> = combineLatest(this._activityService.activities$, this._activityService.users$)
        .pipe(map(([activities, users]) => {
            if (activities) {
                return activities.map(activity => ({
                    ...activity,
                    userName: users.find(u => u.id == activity.createdBy)?.name // Access the username property from the user
                } as Activity))
            }
        }
        ));
    ngOnInit(): void {
        //this.activities$ = this._activityService.activities$;
    }
    getActivity() {
        this.loadingMore = true;
        this._activityService.getActivities(this.counter).pipe(takeUntil(this._unsubscribeAll)).subscribe((newEntries) => {
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
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    sanitizeHtml(htmlString: string): SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(htmlString);
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
