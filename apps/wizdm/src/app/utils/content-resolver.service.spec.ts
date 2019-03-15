import { TestBed, inject } from '@angular/core/testing';

import { ContentResolver } from './content-resolver.service';

describe('ContentResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentResolver]
    });
  });

  it('should ...', inject([ContentResolver], (service: ContentResolver) => {
    expect(service).toBeTruthy();
  }));
});
