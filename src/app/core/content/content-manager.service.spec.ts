import { TestBed, inject } from '@angular/core/testing';

import { ContentService } from './content-manager.service';

describe('ContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentService]
    });
  });

  it('should ...', inject([ContentService], (service: ContentService) => {
    expect(service).toBeTruthy();
  }));
});
