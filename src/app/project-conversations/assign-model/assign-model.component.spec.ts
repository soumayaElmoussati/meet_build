import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignModelComponent } from './assign-model.component';

describe('AssignModelComponent', () => {
  let component: AssignModelComponent;
  let fixture: ComponentFixture<AssignModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
