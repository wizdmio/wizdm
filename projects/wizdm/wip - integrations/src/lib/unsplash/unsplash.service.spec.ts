import { TestBed } from '@angular/core/testing';

import { UnsplashService } from './unsplash.service';

describe('UnsplashService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnsplashService = TestBed.get(UnsplashService);
    expect(service).toBeTruthy();
  });
});
