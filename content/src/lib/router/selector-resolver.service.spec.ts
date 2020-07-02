import { TestBed } from '@angular/core/testing';

import { SelectorResolver } from './selector-resolver.service';

describe('SelectorResolver', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectorResolver = TestBed.get(SelectorResolver);
    expect(service).toBeTruthy();
  });
});
