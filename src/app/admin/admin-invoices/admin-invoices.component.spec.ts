import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvoicesComponent } from './admin-invoices.component';

describe('AdminInvoicesComponent', () => {
  let component: AdminInvoicesComponent;
  let fixture: ComponentFixture<AdminInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
