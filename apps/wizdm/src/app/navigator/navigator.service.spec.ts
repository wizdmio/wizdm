import { TestBed } from '@angular/core/testing';

import { NavigatorService } from './navigator.service';

describe('NavigatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigatorService = TestBed.get(NavigatorService);
    expect(service).toBeTruthy();
  });
});
