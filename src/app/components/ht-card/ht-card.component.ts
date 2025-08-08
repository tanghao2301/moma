import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChildren,
  input,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { LayoutCardDirective } from './ht-card.directive';

type CardType = 'primary' | 'secondary' | 'danger';

@Component({
  selector: 'ht-card',
  standalone: true,
  imports: [NgTemplateOutlet, NgClass],
  templateUrl: './ht-card.component.html',
  styleUrl: './ht-card.component.sass',
})
export class HtCardComponent {
  variant = input<CardType>('primary');
  header!: TemplateRef<any>;
  body!: TemplateRef<any>;
  footer!: TemplateRef<any>;
  icon!: TemplateRef<any>;
  title = input('');

  getVariantClass(): string {
    switch (this.variant()) {
      case 'primary':
        return 'bg-white';
      case 'secondary':
        return 'bg-card';
      default:
        return '';
    }
  }

  @ContentChildren(LayoutCardDirective)
  set layoutCardTemplates(templates: QueryList<LayoutCardDirective>) {
    templates.forEach((template) => {
      switch (template.layoutCardTemplate()) {
        case 'header':
          this.header = template.templateRef;
          break;
        case 'body':
          this.body = template.templateRef;
          break;
        case 'footer':
          this.footer = template.templateRef;
          break;
        default:
          this.icon = template.templateRef;
          break;
      }
    });
  }
}
