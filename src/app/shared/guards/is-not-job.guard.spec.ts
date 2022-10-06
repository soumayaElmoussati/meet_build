import { TestBed } from '@angular/core/testing';

import { IsNotJobGuard } from './is-not-job.guard';

describe('IsNotJobGuard', () => {
  let guard: IsNotJobGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsNotJobGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
