import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { HtLoadingComponent } from './components/ht-loading/ht-loading.component';
import { LoadingService } from './services/loading.service';
import { ToastService } from './services/toast.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, Toast, HtLoadingComponent, AsyncPipe],
  providers: [MessageService, ToastService]
})
export class AppComponent implements OnInit {
  title = 'moma';

  private toastService: ToastService = inject(ToastService);
  private messageService: MessageService = inject(MessageService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private loadingService: LoadingService = inject(LoadingService);

  loading$ = this.loadingService.loading$;

  ngOnInit(): void {
    this.toastService.toast$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((toastContext) => {
        if (!toastContext) return;
        this.messageService.clear();
        this.messageService.add(toastContext);
      });
  }
}
