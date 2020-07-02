import { TestBed } from '@angular/core/testing';

import { TeleportService } from './teleport.service';

describe('TeleportService', () => {
  let service: TeleportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeleportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
