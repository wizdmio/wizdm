import { TestBed } from '@angular/core/testing';

import { StaticResolver } from './static-resolver.service';

describe('StaticResolver', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StaticResolver = TestBed.get(StaticResolver);
    expect(service).toBeTruthy();
  });
});
