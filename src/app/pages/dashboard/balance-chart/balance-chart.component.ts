import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnChanges,
  PLATFORM_ID,
  SimpleChanges
} from '@angular/core';
import { Balance } from '@models/balance.model';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-balance-chart',
  imports: [ChartModule],
  templateUrl: './balance-chart.component.html',
  styleUrl: './balance-chart.component.sass',
})
export class BalanceChartComponent implements OnChanges {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  balances = input<Balance[] | number[]>();
  data: any;

  options: any;

  platformId = inject(PLATFORM_ID);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['balances'] && changes['balances']?.currentValue) {
      this.initChart();
    }
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--color-primary');
      const surfaceBorder = documentStyle.getPropertyValue(
        '--p-content-border-color'
      );

      this.data = {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ],
        datasets: [
          {
            label: 'Balance',
            data: this.balances(),
            fill: true,
            borderColor: documentStyle.getPropertyValue('--color-primary'),
            tension: 0.4,
            backgroundColor: (context: any) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;

              if (!chartArea) {
                return null;
              }

              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, 'rgba(87, 199, 133, 1)');  // solid green at top
              gradient.addColorStop(1, 'rgba(87, 199, 133, 0)');  // transparent at bottom

              return gradient;
            },
          },
        ],
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.9,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: surfaceBorder,
              display: false
            },
          },
          y: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: surfaceBorder
            },
          },
        },
      };
      this.cdr.markForCheck();
    }
  }
}
