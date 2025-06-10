import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err) {
          switch (err.status) {
            case 400:
              break;
            case 401:
              break;
            default:
              break;
          }
        }
        throw err;
      })
    );
};
