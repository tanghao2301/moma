import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type ButtonType = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ht-button',
  imports: [NgClass],
  templateUrl: './ht-button.component.html',
  styleUrl: './ht-button.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtButtonComponent {
  variant = input<ButtonType>('primary');
  size = input<ButtonSize>('md');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  icon = input<string>(); // pass icon class name or SVG
  iconPosition = input<'left' | 'right'>('left');

  getVariantClass(): string {
    switch (this.variant()) {
      case 'primary':
        return 'bg-primary text-white hover:bg-primary/90';
      case 'secondary':
        return 'bg-secondary text-white hover:bg-secondary/90';
      case 'danger':
        return 'bg-danger text-white hover:bg-danger/90';
      default:
        return '';
    }
  }

  getSizeClass(): string {
    switch (this.size()) {
      case 'sm':
        return 'text-sm px-3 py-1.5';
      case 'lg':
        return 'text-lg px-5 py-3';
      case 'md':
      default:
        return 'text-base px-4 py-2';
    }
  }
}
