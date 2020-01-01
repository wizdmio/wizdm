import { TestBed } from '@angular/core/testing';

import { CanLeaveGuard } from './can-leave.service';

describe('CanLeaveGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanLeaveGuard = TestBed.get(CanLeaveGuard);
    expect(service).toBeTruthy();
  });
});
