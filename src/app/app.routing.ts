import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { AppResolver } from './app.resolver';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'home'},

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'example'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        resolve:{
         AppResolver:AppResolver
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        resolve:{
            AppResolver:AppResolver
           },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        resolve:{
            appData: AppResolver
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
            {path: 'terms-policy',loadChildren:()=> import('app/modules/landing/terms-policy/terms-policy.module').then(m=>m.TermsPolicyModule)},
            { path: 'web-form',loadChildren:()=> import('app/modules/landing/web-form/web-form.module').then(m=>m.WebFormModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'checklist', loadChildren: () => import('app/modules/admin/checklist/checklist.module').then(m => m.CheckListModule)},

            {path: 'crm-dashboard', loadChildren: () => import('app/modules/admin/dashboards/crm-dashboard/crm-dashboard.module').then(m => m.CrmDashboardModule)},
            //CRM Routes
            {path:'crm', loadChildren:()=>import('app/modules/admin/crm/crm.module').then(m=>m.CrmModule)},
            //App Routes
            {path: 'app', children: [
                {path: 'calendar', loadChildren: () => import('app/modules/admin/app/calendar/calendar.module').then(m => m.CalendarModule)},
                {path: 'tasks', loadChildren: () => import('app/modules/admin/app/tasks/tasks.module').then(m => m.TasksModule)},
                {path: 'notes', loadChildren: () => import('app/modules/admin/app/notes/notes.module').then(m => m.NotesModule)},
                {path: 'activities', loadChildren: () => import('app/modules/admin/app/activity/activity.module').then(m => m.ActivitiesModule)},
                {path: 'file-manager', loadChildren: () => import('app/modules/admin/app/file-manager/file-manager.module').then(m => m.FileManagerModule)},
                {path: 'scrumboard', loadChildren: () => import('app/modules/admin/app/scrumboard/scrumboard.module').then(m => m.ScrumboardModule)},
                {path: 'chat', loadChildren: () => import('app/modules/admin/app/chat/chat.module').then(m => m.ChatModule)},
                {path: 'widgets', loadChildren: () => import('app/modules/admin/app/widgets/widget.module').then(m => m.WidgetModule)},
                {path: 'dashboards', loadChildren: () => import('app/modules/admin/dashboards/list-dashboard/list-dashboard.module').then(m => m.ListDashboardModule)},

                // {path: 'user-settings', loadChildren: () => import('app/modules/admin/app/settings/settings.module').then(m => m.SettingsModule)},            ]},

           //Marketing
           
           {path: 'user-settings', loadChildren: () => import('app/modules/admin/app/settings/settings.module').then(m => m.SettingsModule)},]},
        //    {path:'checklist', loadChildren:()=>import('app/modules/admin/checklist/checklist.module').then(m=>m.ChecklistModule)},

           {path:'marketing', loadChildren:()=>import('app/modules/admin/marketing/marketing.module').then(m=>m.MarketingModule)}
        ]
    }
];
