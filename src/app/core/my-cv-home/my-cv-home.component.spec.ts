import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCvHomeComponent } from './my-cv-home.component';

describe('MyCvHomeComponent', () => {
  let component: MyCvHomeComponent;
  let fixture: ComponentFixture<MyCvHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCvHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCvHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
