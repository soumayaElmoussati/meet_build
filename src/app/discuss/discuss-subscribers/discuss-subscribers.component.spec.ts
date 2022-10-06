import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussSubscribersComponent } from './discuss-subscribers.component';

describe('DiscussSubscribersComponent', () => {
  let component: DiscussSubscribersComponent;
  let fixture: ComponentFixture<DiscussSubscribersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscussSubscribersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussSubscribersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
