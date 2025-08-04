import { Component } from '@angular/core';
import { HtButtonComponent } from "@components/ht-button/ht-button.component";
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import { LayoutCardDirective } from '@components/ht-card/ht-card.directive';
import { HtTableCellDirective } from '@components/ht-table/elements/ht-table-cell.directive';
import { HtTableHeader, HtTableHeaderDirective } from '@components/ht-table/elements/ht-table-header.directive';
import { HtTableRow } from '@components/ht-table/elements/ht-table-row.directive';
import { HtTableComponent } from '@components/ht-table/ht-table.component';

@Component({
  selector: 'app-examples',
  imports: [HtCardComponent, HtTableComponent, LayoutCardDirective, HtTableHeader, HtTableHeaderDirective, HtTableRow, HtTableCellDirective, HtButtonComponent],
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.sass'
})
export class ExamplesComponent {

}
