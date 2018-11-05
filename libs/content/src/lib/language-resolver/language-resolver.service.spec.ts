import { TestBed } from '@angular/core/testing';

import { LanguageResolver } from './language-resolver.service';

describe('LanguageResolver', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LanguageResolver = TestBed.get(LanguageResolver);
    expect(service).toBeTruthy();
  });
});
