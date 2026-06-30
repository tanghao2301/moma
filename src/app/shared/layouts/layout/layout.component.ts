import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../../components/nav/nav.component';
import { UserService } from '@services/user.service';
import { UserModel } from '@models/user.model';

import { HtButtonComponent } from '@components/ht-button/ht-button.component';
import { HtInputComponent } from '@components/ht-input/ht-input.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavComponent, HtButtonComponent, HtInputComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  private userService = inject(UserService);
  user: UserModel | null = null;

  ngOnInit(): void {
    this.userService.getUserById(this.userService.getUserId()).subscribe(user => {
      this.user = user;
    });
  }
}
