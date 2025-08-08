import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import { LayoutCardDirective } from '@components/ht-card/ht-card.directive';
import { Balance } from '@models/balance.model';
import { UserModel } from '@models/user.model';
import { TransactionsService } from '@services/transactions.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [HtCardComponent, LayoutCardDirective, CurrencyPipe, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private transactionsService: TransactionsService = inject(TransactionsService);
    private userService: UserService = inject(UserService);
  balance!: Balance;
  previousBalance!: Balance;
  percentageBalance!: number;
  user!: UserModel;

  ngOnInit(): void {
  }
}
