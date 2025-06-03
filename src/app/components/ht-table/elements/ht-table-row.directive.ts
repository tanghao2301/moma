import { Component, ContentChildren, QueryList } from "@angular/core";
import { HtTableCellDirective } from "./ht-table-cell.directive";

@Component({
    selector: 'ht-table-row',
    template: '<ng-content></ng-content>'
})
export class HtTableRow {
    @ContentChildren(HtTableCellDirective) cellElements!: QueryList<HtTableCellDirective>;
}