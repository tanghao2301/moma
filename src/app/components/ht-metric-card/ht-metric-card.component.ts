import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import { LayoutCardDirective } from '@components/ht-card/ht-card.directive';
import { SkeletonModule } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';
import { AbsPipe } from 'src/app/pipes/absolute.pipe';

@Component({
  selector: 'ht-metric-card',
  standalone: true,
  imports: [
    HtCardComponent,
    LayoutCardDirective,
    NgClass,
    AbsPipe,
    CurrencyPipe,
    DecimalPipe,
    SkeletonModule,
    Tooltip,
  ],
  templateUrl: './ht-metric-card.component.html',
  styleUrl: './ht-metric-card.component.scss',
})
export class HtMetricCardComponent {
  title = input.required<string>();
  value = input<number | null | undefined>(0);
  percentage = input<number>(0);
  previousValue = input<number | null | undefined>(0);
  isLoading = input<boolean>(false);
}
