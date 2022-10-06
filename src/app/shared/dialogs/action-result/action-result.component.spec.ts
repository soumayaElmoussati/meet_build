import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionResultComponent } from './action-result.component';

describe('ActionResultComponent', () => {
  let component: ActionResultComponent;
  let fixture: ComponentFixture<ActionResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
