import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './shared/layouts/layout/layout.component';
import { PageNotFoundComponent } from './shared/pages/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'signup',
    title: 'Signup',
    loadComponent: () =>
      import('./pages/signup/signup.component').then((c) => c.SignupComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'budgets',
        title: 'Budgets',
        loadComponent: () =>
          import('./pages/budgets/budgets.component').then(
            (c) => c.BudgetsComponent
          ),
      },
    ],
    canActivate: [AuthGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];
