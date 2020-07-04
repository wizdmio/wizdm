import { TestBed } from '@angular/core/testing';

import { BackgroundService } from './background.service';

describe('BackgroundService', () => {
  let service: BackgroundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
