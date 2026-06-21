import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferralService } from '@services/referral.service';
import { UserService } from '@services/user.service';
import { UserReferralInfo, ReferralModel } from '@models/referral.model';
import { Observable } from 'rxjs';
import { HtButtonComponent } from '@components/ht-button/ht-button.component';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import { DashboardLayoutComponent } from '@shared/layouts/dashboard-layout/dashboard-layout.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-referral',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayoutComponent,
    HtCardComponent,
    HtButtonComponent,
    ToastModule,
    SkeletonModule
  ],
  providers: [MessageService],
  templateUrl: './referral.component.html',
  styleUrl: './referral.component.scss'
})
export class ReferralComponent implements OnInit {
  private referralService = inject(ReferralService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);

  referralInfo$!: Observable<UserReferralInfo>;
  recentReferrals$!: Observable<ReferralModel[]>;
  userId: string = this.userService.getUserId();

  ngOnInit(): void {
    if (this.userId) {
      this.referralInfo$ = this.referralService.getUserReferralInfo(this.userId);
      this.recentReferrals$ = this.referralService.getReferrals(this.userId);
    }
  }

  async copyToClipboard(link: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(link);
      this.messageService.add({
        severity: 'success',
        summary: 'Copied!',
        detail: 'Referral link copied to clipboard',
        life: 3000
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  shareOnSocial(platform: string, link: string): void {
    let url = '';
    const text = 'Join me on Moma and manage your finances better!';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  }
}
