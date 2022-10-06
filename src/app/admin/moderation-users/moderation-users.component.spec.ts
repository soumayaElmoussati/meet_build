import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationUsersComponent } from './moderation-users.component';

describe('ModerationUsersComponent', () => {
  let component: ModerationUsersComponent;
  let fixture: ComponentFixture<ModerationUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModerationUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModerationUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
