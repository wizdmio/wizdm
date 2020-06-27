import { TestBed } from '@angular/core/testing';

import { ValidProfileService } from './valid-profile.service';

describe('ValidProfileService', () => {
  let service: ValidProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
