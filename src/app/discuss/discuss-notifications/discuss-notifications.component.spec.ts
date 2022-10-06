import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussNotificationsComponent } from './discuss-notifications.component';

describe('DiscussNotificationsComponent', () => {
  let component: DiscussNotificationsComponent;
  let fixture: ComponentFixture<DiscussNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscussNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
