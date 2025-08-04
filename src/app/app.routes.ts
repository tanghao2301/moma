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
  {
    path: 'onboarding',
    children: [
      {
        path: '',
        title: 'Onboarding',
        loadComponent: () =>
          import('./pages/onboarding-flow/onboarding/onboarding.component').then((c) => c.OnboardingComponent),
      },
      {
        path: 'personal-info',
        title: 'Personal Info',
        loadComponent: () =>
          import('./pages/onboarding-flow/personal-info/personal-info.component').then(
            (c) => c.PersonalInfoComponent
          ),
      },
      {
        path: 'income',
        title: 'Income',
        loadComponent: () =>
          import('./pages/onboarding-flow/income/income.component').then(
            (c) => c.IncomeComponent
          ),
      },
    ],
    canActivate: [AuthGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];
