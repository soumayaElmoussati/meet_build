import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteProfileComponent } from './favorite-profile.component';

describe('FavoriteProfileComponent', () => {
  let component: FavoriteProfileComponent;
  let fixture: ComponentFixture<FavoriteProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
