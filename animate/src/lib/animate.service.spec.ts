import { TestBed } from '@angular/core/testing';

import { AnimateService } from './animate.service';

describe('AnimateService', () => {
  let service: AnimateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
