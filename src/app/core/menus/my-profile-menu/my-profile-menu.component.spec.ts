import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileMenuComponent } from './my-profile-menu.component';

describe('MyProfileMenuComponent', () => {
  let component: MyProfileMenuComponent;
  let fixture: ComponentFixture<MyProfileMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProfileMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
