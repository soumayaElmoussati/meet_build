import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussSubscriptionsComponent } from './discuss-subscriptions.component';

describe('DiscussSubscriptionsComponent', () => {
  let component: DiscussSubscriptionsComponent;
  let fixture: ComponentFixture<DiscussSubscriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscussSubscriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
