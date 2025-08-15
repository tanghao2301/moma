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
      icon: 'pi-home',
    },
    {
      title: 'Budgets',
      url: '/budgets',
      icon: 'pi-credit-card',
    },
  ];

  async convertToVND(
    amount: number,
    currency: string
  ): Promise<number> {
    const rates: Record<string, number> = {
      VND: 1,
      USD: 25400,
      EUR: 28000,
      JPY: 170,
    };

    const rate = rates[currency];
    if (!rate) throw new Error(`Unsupported currency: ${currency}`);
    return amount * rate;
  }
}
