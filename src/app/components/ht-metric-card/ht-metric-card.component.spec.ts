import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtMetricCardComponent } from './ht-metric-card.component';

describe('HtMetricCardComponent', () => {
  let component: HtMetricCardComponent;
  let fixture: ComponentFixture<HtMetricCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtMetricCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtMetricCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
