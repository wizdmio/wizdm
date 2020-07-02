import { TestBed } from '@angular/core/testing';

import { DoorbellService } from './doorbell.service';

describe('DoorbellService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DoorbellService = TestBed.get(DoorbellService);
    expect(service).toBeTruthy();
  });
});
