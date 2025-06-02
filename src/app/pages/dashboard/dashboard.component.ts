import { Component } from '@angular/core';
import { HtCardComponent } from "../../components/ht-card/ht-card.component";
import { LayoutCardDirective } from '../../components/ht-card/ht-card.directive';
import { HtTableComponent } from '../../components/ht-table/ht-table.component';

@Component({
  selector: 'app-dashboard',
  imports: [HtCardComponent, HtTableComponent, LayoutCardDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent {

}
