import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, ContentChildren, QueryList } from '@angular/core';
import { HtTableHeader } from './elements/ht-table-header.directive';
import { HtTableRow } from './elements/ht-table-row.directive';

@Component({
  selector: 'ht-table',
  imports: [NgTemplateOutlet],
  templateUrl: './ht-table.component.html',
  styleUrl: './ht-table.component.scss'
})
export class HtTableComponent {
  @ContentChild(HtTableHeader) htTableHeader!: HtTableHeader;
  @ContentChildren(HtTableRow) htTableRows!: QueryList<HtTableRow>;
}
