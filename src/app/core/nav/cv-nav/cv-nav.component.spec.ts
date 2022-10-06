import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvNavComponent } from './cv-nav.component';

describe('CvNavComponent', () => {
  let component: CvNavComponent;
  let fixture: ComponentFixture<CvNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
