import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPosteComponent } from './report-poste.component';

describe('ReportPosteComponent', () => {
  let component: ReportPosteComponent;
  let fixture: ComponentFixture<ReportPosteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPosteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPosteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
