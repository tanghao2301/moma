import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
  private loadingService: LoadingService = inject(LoadingService);

  loading$ = this.loadingService.loading$;

  ngOnInit(): void {
    this.toastService.toast$
      .subscribe((toastContext) => {
        if (!toastContext) return;
        this.messageService.clear();
        this.messageService.add(toastContext);
      });
  }
}
