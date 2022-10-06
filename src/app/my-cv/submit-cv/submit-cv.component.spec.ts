import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitCvComponent } from './submit-cv.component';

describe('SubmitCvComponent', () => {
  let component: SubmitCvComponent;
  let fixture: ComponentFixture<SubmitCvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitCvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
