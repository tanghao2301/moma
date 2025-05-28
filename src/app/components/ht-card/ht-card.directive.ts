import { Directive, inject, input, TemplateRef } from "@angular/core";

@Directive({
    selector: '[layoutCardTemplate]',
})
export class LayoutCardDirective {
    public templateRef: TemplateRef<any> = inject(TemplateRef);
    layoutCardTemplate = input<'header' | 'body' | 'footer' | 'icon' | null>();
}