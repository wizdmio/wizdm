import { TestBed } from '@angular/core/testing';

import { ContentLoader } from './content-loader.service';

describe('ContentLoader', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentLoader = TestBed.get(ContentLoader);
    expect(service).toBeTruthy();
  });
});
