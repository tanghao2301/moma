import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err) {
          switch (err.status) {
            case 400:
              toastService.error('Bad Request', err.error?.message || err.message || 'An error occurred');
              break;
            case 401:
              toastService.error('Unauthorized', 'Please log in again');
              localStorage.clear();
              router.navigateByUrl('/login');
              break;
            default:
              toastService.error('Error', err.error?.message || err.message || 'An unexpected error occurred');
              break;
          }
        }
        throw err;
      })
    );
};
