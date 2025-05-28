import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtCardComponent } from './ht-card.component';

describe('HtCardComponent', () => {
  let component: HtCardComponent;
  let fixture: ComponentFixture<HtCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
