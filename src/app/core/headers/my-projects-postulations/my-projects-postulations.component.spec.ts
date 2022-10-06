import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjectsPostulationsComponent } from './my-projects-postulations.component';

describe('MyProjectsPostulationsComponent', () => {
  let component: MyProjectsPostulationsComponent;
  let fixture: ComponentFixture<MyProjectsPostulationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProjectsPostulationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProjectsPostulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
