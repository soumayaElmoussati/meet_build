import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostulationsHomeComponent } from './postulations-home.component';

describe('PostulationsHomeComponent', () => {
  let component: PostulationsHomeComponent;
  let fixture: ComponentFixture<PostulationsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostulationsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostulationsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
