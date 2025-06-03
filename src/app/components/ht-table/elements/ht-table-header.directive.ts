import { Component, ContentChildren, Directive, QueryList, TemplateRef } from "@angular/core";

@Directive({
    selector: '[tableHeader]'
})
export class HtTableHeaderDirective {
    constructor(public el: TemplateRef<any>) {}
}

@Component({
    selector: 'ht-table-header',
    template: '<ng-content></ng-content>'
})
export class HtTableHeader {
    @ContentChildren(HtTableHeaderDirective) headerEle!: QueryList<HtTableHeaderDirective>;
}