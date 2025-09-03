import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  imports: [],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {
  @Input() title!: string;
}
