import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserModel } from '@models/user.model';
import { CommonService } from '@services/common.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit {
  private userService: UserService = inject(UserService);
  protected commonService: CommonService = inject(CommonService);
  user: UserModel = {} as UserModel;
  
  ngOnInit(): void {
    this.userService.getUserById(this.userService.getUserId()).subscribe(user => this.user = user);
  }
}
