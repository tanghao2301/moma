import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: '[tableCell]'
})
export class HtTableCellDirective {
    constructor(public el: TemplateRef<any>) {}
}