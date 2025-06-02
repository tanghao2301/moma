import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtTableComponent } from './ht-table.component';

describe('HtTableComponent', () => {
  let component: HtTableComponent;
  let fixture: ComponentFixture<HtTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
