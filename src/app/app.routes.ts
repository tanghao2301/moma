import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/pages/page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)
    },
    { path: '**', component: PageNotFoundComponent },
];
