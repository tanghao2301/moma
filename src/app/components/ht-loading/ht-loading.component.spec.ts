import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtLoadingComponent } from './ht-loading.component';

describe('HtLoadingComponent', () => {
  let component: HtLoadingComponent;
  let fixture: ComponentFixture<HtLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
