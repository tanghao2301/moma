import { Component, input } from '@angular/core';

@Component({
  selector: 'ht-loading',
  imports: [],
  templateUrl: './ht-loading.component.html',
  styleUrl: './ht-loading.component.scss',
})
export class HtLoadingComponent {
  visible = input(false);
}
