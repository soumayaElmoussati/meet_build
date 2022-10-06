import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponPromoComponent } from './coupon-promo.component';

describe('CouponPromoComponent', () => {
  let component: CouponPromoComponent;
  let fixture: ComponentFixture<CouponPromoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponPromoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
