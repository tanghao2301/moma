import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChildren,
  input,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { LayoutCardDirective } from './ht-card.directive';

@Component({
  selector: 'ht-card',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './ht-card.component.html',
  styleUrl: './ht-card.component.sass',
})
export class HtCardComponent {
  header!: TemplateRef<any>;
  body!: TemplateRef<any>;
  footer!: TemplateRef<any>;
  icon!: TemplateRef<any>;
  title = input('');

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
