import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileHomeComponent } from './my-profile-home.component';

describe('MyProfileHomeComponent', () => {
  let component: MyProfileHomeComponent;
  let fixture: ComponentFixture<MyProfileHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProfileHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
