import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionNavComponent } from './mission-nav.component';

describe('MissionNavComponent', () => {
  let component: MissionNavComponent;
  let fixture: ComponentFixture<MissionNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
