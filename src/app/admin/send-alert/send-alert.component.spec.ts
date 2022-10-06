import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendAlertComponent } from './send-alert.component';

describe('SendAlertComponent', () => {
  let component: SendAlertComponent;
  let fixture: ComponentFixture<SendAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
