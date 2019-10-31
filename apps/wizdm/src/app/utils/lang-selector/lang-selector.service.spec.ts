import { TestBed } from '@angular/core/testing';

import { LanguageSelector } from './lang-selector.service';

describe('LanguageSelector', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LanguageSelector = TestBed.get(LanguageSelector);
    expect(service).toBeTruthy();
  });
});
