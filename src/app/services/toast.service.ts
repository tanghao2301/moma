import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ToastModel {
  severity: 'success' | 'info' | 'warn' | 'error' | 'contrast' | 'secondary';
  summary: string;
  detail: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject: BehaviorSubject<ToastModel | null> =
    new BehaviorSubject<ToastModel | null>(null);
  toast$ = this.toastSubject.asObservable();

  showToast(
    type:
      | 'success'
      | 'info'
      | 'warn'
      | 'error'
      | 'contrast'
      | 'secondary' = 'info',
    title: string = '',
    content: string = ''
  ): void {
    this.toastSubject.next({ severity: type, summary: title, detail: content });
  }

  error(
    title: string = '',
    content: string = ''
  ): void {
    this.toastSubject.next({ severity: 'error', summary: title, detail: content });
  }
}
