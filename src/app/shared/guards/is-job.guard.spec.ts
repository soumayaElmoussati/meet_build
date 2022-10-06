import { TestBed } from '@angular/core/testing';

import { IsJobGuard } from './is-job.guard';

describe('IsJobGuard', () => {
  let guard: IsJobGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsJobGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
