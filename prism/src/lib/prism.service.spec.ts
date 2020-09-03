import { TestBed } from '@angular/core/testing';

import { PrismService } from './prism.service';

describe('PrismService', () => {
  let service: PrismService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrismService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
