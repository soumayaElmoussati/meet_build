import { TestBed } from '@angular/core/testing';

import { IsMissionGuard } from './is-mission.guard';

describe('IsMissionGuard', () => {
  let guard: IsMissionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsMissionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
