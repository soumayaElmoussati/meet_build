import { TestBed } from '@angular/core/testing';

import { IsJobMissionGuard } from './is-job-mission.guard';

describe('IsJobMissionGuard', () => {
  let guard: IsJobMissionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsJobMissionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
