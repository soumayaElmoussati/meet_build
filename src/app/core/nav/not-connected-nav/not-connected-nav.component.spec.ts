import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotConnectedNavComponent } from './not-connected-nav.component';

describe('NotConnectedNavComponent', () => {
  let component: NotConnectedNavComponent;
  let fixture: ComponentFixture<NotConnectedNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotConnectedNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotConnectedNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
