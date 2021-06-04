import { TestBed } from '@angular/core/testing';

import { LazyImageService } from './lazy-image.service';

describe('LazyImageService', () => {
  let service: LazyImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LazyImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
