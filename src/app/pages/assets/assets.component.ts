import {
  AsyncPipe,
  CommonModule,
  CurrencyPipe,
} from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HtButtonComponent } from '@components/ht-button/ht-button.component';
import { HtInputComponent } from '@components/ht-input/ht-input.component';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import { HtTableComponent } from '@components/ht-table/ht-table.component';
import { HtTableHeader, HtTableHeaderDirective } from '@components/ht-table/elements/ht-table-header.directive';
import { HtTableRow } from '@components/ht-table/elements/ht-table-row.directive';
import { HtTableCellDirective } from '@components/ht-table/elements/ht-table-cell.directive';
import { Asset, ASSET_TYPE_OPTIONS, AssetType } from '@models/asset.model';
import { AssetsService } from '@services/assets.service';
import { LoadingService } from '@services/loading.service';
import { ToastService } from '@services/toast.service';
import { UserService } from '@services/user.service';
import { LocaleService } from '@services/locale.service';
import { DashboardLayoutComponent } from '@shared/layouts/dashboard-layout/dashboard-layout.component';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
    SkeletonModule,
    SelectModule,
    Dialog,
    InputNumber,
    TooltipModule,
    ButtonModule,
    DashboardLayoutComponent,
    HtCardComponent,
    HtButtonComponent,
    HtInputComponent,
    HtTableComponent,
    HtTableHeader,
    HtTableHeaderDirective,
    HtTableRow,
    HtTableCellDirective,
  ],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
})
export class AssetsComponent implements OnInit {
  public localeService = inject(LocaleService);
  ASSET_TYPE_OPTIONS = ASSET_TYPE_OPTIONS;

  private destroyRef: DestroyRef = inject(DestroyRef);
  private assetsService: AssetsService = inject(AssetsService);
  private loadingService: LoadingService = inject(LoadingService);
  private toastService: ToastService = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);
  private userService: UserService = inject(UserService);

  assets$: Observable<Asset[] | null> = this.assetsService.getAssets();
  isLoading$: Observable<boolean> = this.assetsService.getIsLoading();

  userId!: string;
  visible: boolean = false;
  isEdit: boolean = false;
  selectedAssetId: string | null = null;

  // Stats
  totalNetWorth: number = 0;
  liquidAssets: number = 0;
  investments: number = 0;

  assetForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    type: [null, Validators.required],
    amount: [null, Validators.required],
    institution: [''],
    note: ['']
  });

  ngOnInit(): void {
    this.userId = this.userService.getUserId();
    this.assetsService.fetchAssets(this.userId).subscribe();

    this.assets$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(assets => {
      if (assets) {
        this.calculateStats(assets);
      }
    });
  }

  calculateStats(assets: Asset[]): void {
    this.totalNetWorth = assets.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    this.liquidAssets = assets
      .filter(a => a.type === AssetType.CASH || a.type === AssetType.BANK)
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
    this.investments = assets
      .filter(a => a.type === AssetType.INVESTMENT || a.type === AssetType.CRYPTO || a.type === AssetType.GOLD || a.type === AssetType.REAL_ESTATE)
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }

  getAssetTypeIcon(typeValue: string): string {
    const option = this.ASSET_TYPE_OPTIONS.find(opt => opt.value === typeValue);
    return option ? option.icon : 'pi-question-circle';
  }

  showAddDialog(): void {
    this.isEdit = false;
    this.selectedAssetId = null;
    this.assetForm.reset();
    this.visible = true;
  }

  showEditDialog(asset: Asset): void {
    this.isEdit = true;
    this.selectedAssetId = asset.id!;
    this.assetForm.patchValue({
      name: asset.name,
      type: this.ASSET_TYPE_OPTIONS.find(opt => opt.value === asset.type),
      amount: asset.amount,
      institution: asset.institution,
      note: asset.note
    });
    this.visible = true;
  }

  saveAsset(): void {
    if (this.assetForm.invalid) return;

    this.loadingService.show();
    const formValue = this.assetForm.value;
    const activeCurrency = this.localeService.activeCurrency();
    const assetData: Asset = {
      name: formValue.name,
      type: formValue.type.value,
      amount: formValue.amount,
      currency: activeCurrency,
      institution: formValue.institution,
      note: formValue.note
    };

    const action = this.isEdit 
      ? this.assetsService.updateAsset(this.userId, this.selectedAssetId!, assetData)
      : this.assetsService.addAsset(this.userId, assetData);

    action.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loadingService.hide();
        this.toastService.success('Success', `Asset ${this.isEdit ? 'updated' : 'added'} successfully`);
        this.visible = false;
      },
      error: (err) => {
        this.loadingService.hide();
        this.toastService.error('Error', 'Failed to save asset. Please try again.');
        console.error(err);
      }
    });
  }

  deleteAsset(assetId: string): void {
    if (confirm('Are you sure you want to delete this asset?')) {
      this.loadingService.show();
      this.assetsService.deleteAsset(this.userId, assetId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.loadingService.hide();
          this.toastService.success('Success', 'Asset deleted successfully');
        },
        error: (err) => {
          this.loadingService.hide();
          this.toastService.error('Error', 'Failed to delete asset');
          console.error(err);
        }
      });
    }
  }

  getDistribution(assets: Asset[] | null): {label: string, value: number, color: string}[] {
    if (!assets || assets.length === 0) return [];
    
    const groups = assets.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    const colors: Record<string, string> = {
      [AssetType.CASH]: '#4ade80',
      [AssetType.BANK]: '#60a5fa',
      [AssetType.INVESTMENT]: '#facc15',
      [AssetType.CRYPTO]: '#f87171',
      [AssetType.GOLD]: '#fbbf24',
      [AssetType.REAL_ESTATE]: '#a78bfa',
      [AssetType.OTHER]: '#94a3b8'
    };

    return Object.keys(groups).map(key => ({
      label: key,
      value: (groups[key] / this.totalNetWorth) * 100,
      color: colors[key] || '#94a3b8'
    })).sort((a, b) => b.value - a.value);
  }
}
