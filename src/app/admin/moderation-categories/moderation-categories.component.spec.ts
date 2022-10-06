import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationCategoriesComponent } from './moderation-categories.component';

describe('ModerationCategoriesComponent', () => {
  let component: ModerationCategoriesComponent;
  let fixture: ComponentFixture<ModerationCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModerationCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModerationCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
