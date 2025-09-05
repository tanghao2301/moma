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
    {
      title: 'Installment',
      url: '/installment',
      icon: 'pi-calendar-clock',
    },
    {
      title: 'Assets',
      url: '/assets',
      icon: 'pi-wallet',
    },
    {
      title: 'Goals',
      url: '/goals',
      icon: 'pi-bullseye',
    },
    {
      title: 'Saving',
      url: '/saving',
      icon: 'pi-inbox',
    },
    {
      title: 'Report',
      url: '/report',
      icon: 'pi-book',
    },
    {
      title: 'Referral',
      url: '/referral',
      icon: 'pi-comments',
    },
    {
      title: 'Setting',
      url: '/setting',
      icon: 'pi-cog',
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
