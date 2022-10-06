import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectConversationsComponent } from './project-conversations.component';

describe('ProjectConversationsComponent', () => {
  let component: ProjectConversationsComponent;
  let fixture: ComponentFixture<ProjectConversationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectConversationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectConversationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
