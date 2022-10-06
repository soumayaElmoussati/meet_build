import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationCodeNaceComponent } from './moderation-code-nace.component';

describe('ModerationCodeNaceComponent', () => {
  let component: ModerationCodeNaceComponent;
  let fixture: ComponentFixture<ModerationCodeNaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModerationCodeNaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModerationCodeNaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
