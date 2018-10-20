import { TestBed } from '@angular/core/testing';

import { UserLanguageResolver } from './language-resolver.service';

describe('UserLanguageResolver', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserLanguageResolver = TestBed.get(UserLanguageResolver);
    expect(service).toBeTruthy();
  });
});
