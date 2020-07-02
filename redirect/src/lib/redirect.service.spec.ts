import { TestBed } from '@angular/core/testing';

import { RedirectService } from './redirect.service';

describe('RedirectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RedirectService = TestBed.get(RedirectService);
    expect(service).toBeTruthy();
  });
});
