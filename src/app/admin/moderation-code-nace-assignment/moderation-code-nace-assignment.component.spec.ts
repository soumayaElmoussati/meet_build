import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationCodeNaceAssignmentComponent } from './moderation-code-nace-assignment.component';

describe('ModerationCodeNaceAssignmentComponent', () => {
  let component: ModerationCodeNaceAssignmentComponent;
  let fixture: ComponentFixture<ModerationCodeNaceAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModerationCodeNaceAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModerationCodeNaceAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
