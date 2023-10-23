import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { environment } from 'environments/environment';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { cloneDeep } from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{

    private  _compactNavigation: FuseNavigationItem[];
    private  _defaultNavigation: FuseNavigationItem[];
    private  _futuristicNavigation: FuseNavigationItem[];
    private  _horizontalNavigation: FuseNavigationItem[];
    //URLS
    private readonly getMenuUrl = `${environment.url}/AppMenu/all`
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    defautList:FuseNavigationItem[] = [];
    // defaultObj:FuseNavigationItem;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<any>
    {
        return this._httpClient.get<any>(this.getMenuUrl).pipe(
            tap(data=>{
                this._compactNavigation = [...data.allMenu];
                this._defaultNavigation = [...data.defaultList];
                this._compactNavigation = [...data.allMenu];
                this._futuristicNavigation = [...data.allMenu];
                this._horizontalNavigation = [...data.allMenu];
                this._compactNavigation.forEach((compactNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === compactNavItem.id )
                        {
                            compactNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });
                // Fill futuristic navigation children using the default navigation
                this._futuristicNavigation.forEach((futuristicNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === futuristicNavItem.id )
                        {
                            futuristicNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });
                // Fill horizontal navigation children using the default navigation
                this._horizontalNavigation.forEach((horizontalNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === horizontalNavItem.id )
                        {
                            horizontalNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });
                const nav:Navigation={

                        compact   : cloneDeep(this._compactNavigation),
                        default   : cloneDeep(this._defaultNavigation),
                        futuristic: cloneDeep(this._futuristicNavigation),
                        horizontal: cloneDeep(this._horizontalNavigation)
                }
                this._navigation.next(nav);
            })
        )

    }

}
