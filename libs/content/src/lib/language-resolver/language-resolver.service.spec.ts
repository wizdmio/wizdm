import { TestBed } from '@angular/core/testing';

import { LanguageResolverService } from './language-resolver.service';

describe('LanguageResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LanguageResolverService = TestBed.get(LanguageResolverService);
    expect(service).toBeTruthy();
  });
});
