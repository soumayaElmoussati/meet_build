import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedProjectsComponent } from './created-projects.component';

describe('CreatedProjectsComponent', () => {
  let component: CreatedProjectsComponent;
  let fixture: ComponentFixture<CreatedProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatedProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
