import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotConnectedComponent } from './not-connected.component';

describe('NotConnectedComponent', () => {
  let component: NotConnectedComponent;
  let fixture: ComponentFixture<NotConnectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotConnectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
