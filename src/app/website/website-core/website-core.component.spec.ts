import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteCoreComponent } from './website-core.component';

describe('WebsiteCoreComponent', () => {
  let component: WebsiteCoreComponent;
  let fixture: ComponentFixture<WebsiteCoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteCoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
