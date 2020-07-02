import { TestBed } from '@angular/core/testing';

import { GtagService } from './gtag.service';

describe('GtagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GtagService = TestBed.get(GtagService);
    expect(service).toBeTruthy();
  });
});
