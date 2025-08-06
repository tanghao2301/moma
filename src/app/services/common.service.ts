import { Injectable } from '@angular/core';
import { UrlModel } from '@models/common.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
    urls: UrlModel[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: 'pi-home'
        },
        {
            title: 'Budgets',
            url: '/budgets',
            icon: 'pi-credit-card'
        }
    ]
}
