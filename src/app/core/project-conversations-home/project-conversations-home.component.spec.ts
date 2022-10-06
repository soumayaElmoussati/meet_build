import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectConversationsHomeComponent } from './project-conversations-home.component';

describe('ProjectConversationsHomeComponent', () => {
  let component: ProjectConversationsHomeComponent;
  let fixture: ComponentFixture<ProjectConversationsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectConversationsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectConversationsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
