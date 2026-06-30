import { Component, ContentChildren, EventEmitter, Input, Output, QueryList } from "@angular/core";
import { HtTableCellDirective } from "./ht-table-cell.directive";

@Component({
    selector: 'ht-table-row',
    template: '<ng-content></ng-content>'
})
export class HtTableRow {
    @Input() active: boolean = false;
    @Input() hoverable: boolean = true;
    @Output() rowClick = new EventEmitter<Event>();

    @ContentChildren(HtTableCellDirective) cellElements!: QueryList<HtTableCellDirective>;
}