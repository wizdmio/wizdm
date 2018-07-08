import { TestBed, inject } from '@angular/core/testing';

import { PageGuardService } from './page-guard.service';

describe('PageGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageGuardService]
    });
  });

  it('should be created', inject([PageGuardService], (service: PageGuardService) => {
    expect(service).toBeTruthy();
  }));
});
