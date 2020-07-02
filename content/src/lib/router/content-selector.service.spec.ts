import { TestBed } from '@angular/core/testing';

import { ContentSelector } from './content-selector.service';

describe('ContentSelector', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentSelector = TestBed.get(ContentSelector);
    expect(service).toBeTruthy();
  });
});
