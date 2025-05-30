import { inject, Injectable } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { User } from 'firebase/auth';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  canActivate(): MaybeAsync<GuardResult> {
    return this.authService.user$.pipe(
      map((user: User) => {
        if (!!user || !!localStorage.getItem('user')) {
          return true;
        } else {
          this.router.navigateByUrl('/login');
          return false;
        }
      })
    );
  }
}
