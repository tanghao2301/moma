import { inject, Injectable, signal } from '@angular/core';
import { first } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private userService = inject(UserService);

  // Expose signals for reactivity
  activeLocale = signal<string>('en-US');
  activeCurrency = signal<string>('USD');

  constructor() {
    // Load from local storage initially
    const localLang = localStorage.getItem('preferredLanguage') || 'en';
    const localCurr = localStorage.getItem('preferredCurrency') || 'USD';
    
    this.activeLocale.set(this.getLocaleFromLanguage(localLang));
    this.activeCurrency.set(localCurr);

    // If a user is logged in, load preferences from Firestore
    const userId = this.userService.getUserId();
    if (userId) {
      this.loadUserPreferences(userId);
    }
  }

  getLocaleFromLanguage(lang: string): string {
    return lang === 'vi' ? 'vi-VN' : 'en-US';
  }

  loadUserPreferences(userId: string): void {
    this.userService.getUserById(userId).pipe(first()).subscribe((user) => {
      if (user) {
        if (user.preferredLanguage) {
          localStorage.setItem('preferredLanguage', user.preferredLanguage);
          this.activeLocale.set(this.getLocaleFromLanguage(user.preferredLanguage));
        }
        if (user.preferredCurrency) {
          localStorage.setItem('preferredCurrency', user.preferredCurrency);
          this.activeCurrency.set(user.preferredCurrency);
        }
      }
    });
  }

  setLanguage(lang: string, saveToDb = true): void {
    localStorage.setItem('preferredLanguage', lang);
    this.activeLocale.set(this.getLocaleFromLanguage(lang));

    if (saveToDb) {
      const userId = this.userService.getUserId();
      if (userId) {
        this.userService.updateUserById(userId, { preferredLanguage: lang }).subscribe();
      }
    }
  }

  setCurrency(currency: string, saveToDb = true): void {
    localStorage.setItem('preferredCurrency', currency);
    this.activeCurrency.set(currency);

    if (saveToDb) {
      const userId = this.userService.getUserId();
      if (userId) {
        this.userService.updateUserById(userId, { preferredCurrency: currency }).subscribe();
      }
    }
  }
}
