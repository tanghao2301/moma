import { Injectable } from '@angular/core';
import { UrlModel } from '@models/common.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
    urls: UrlModel[] = [
        {
            title: 'Dashboard',
            url: '/dashboard'
        },
        {
            title: 'Budgets',
            url: '/budgets'
        }
    ]
}
