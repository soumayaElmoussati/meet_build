import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobNavComponent } from './job-nav.component';

describe('JobNavComponent', () => {
  let component: JobNavComponent;
  let fixture: ComponentFixture<JobNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
