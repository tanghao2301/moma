import { inject, Injectable } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { FirebaseService } from '@services/firebase.service';
import { User } from 'firebase/auth';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router: Router = inject(Router);
  private firebaseService: FirebaseService = inject(FirebaseService);
  canActivate(): MaybeAsync<GuardResult> {
    return this.firebaseService.user$.pipe(
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
