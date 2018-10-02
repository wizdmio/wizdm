import { TestBed, inject } from '@angular/core/testing';

import { RemarkService } from './remark.service';

describe('RemarkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemarkService]
    });
  });

  it('should be created', inject([RemarkService], (service: RemarkService) => {
    expect(service).toBeTruthy();
  }));
});
