import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ContentChild, ContentChildren, TemplateRef } from '@angular/core';
import { HtTableHeader } from './elements/ht-table-header.directive';
import { HtTableRow } from './elements/ht-table-row.directive';

@Component({
  selector: 'ht-table',
  imports: [NgTemplateOutlet],
  templateUrl: './ht-table.component.html',
  styleUrl: './ht-table.component.sass'
})
export class HtTableComponent implements AfterViewInit{
  @ContentChild(HtTableHeader) htTableHeader!: HtTableHeader;
  @ContentChildren(HtTableRow) htTableRows!: HtTableRow[]
  headerColumnElements: TemplateRef<any>[] = [];
  rowElements: Array<any> = [];
  
  ngAfterViewInit(): void {
    this.htTableHeader.headerEle.forEach(headerCell => {
      this.headerColumnElements.push(headerCell.el);
    });
    this.htTableRows.forEach(row => {
      const rowEle = {
        ...row,
        cellElements: row.cellElements.map(cell => cell.el)
      }
      this.rowElements.push(rowEle);
    });
  }
}
