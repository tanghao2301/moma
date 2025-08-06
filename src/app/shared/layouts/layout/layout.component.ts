import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserModel } from '@models/user.model';
import { CommonService } from '@services/common.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  private userService: UserService = inject(UserService);
  protected commonService: CommonService = inject(CommonService);
  user: UserModel = {} as UserModel;
  
  ngOnInit(): void {
    this.userService.getUserById(this.userService.getUserId()).subscribe(user => this.user = user);
  }
}
