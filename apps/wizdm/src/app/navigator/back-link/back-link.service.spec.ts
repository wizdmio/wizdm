import { TestBed } from '@angular/core/testing';

import { BackLinkService } from './back-link.service';

describe('BackLinkService', () => {
  let service: BackLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
