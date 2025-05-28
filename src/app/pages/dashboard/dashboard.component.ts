import { Component } from '@angular/core';
import { HtCardComponent } from "../../components/ht-card/ht-card.component";
import { LayoutCardDirective } from '../../components/ht-card/ht-card.directive';

@Component({
  selector: 'app-dashboard',
  imports: [HtCardComponent, LayoutCardDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent {

}
