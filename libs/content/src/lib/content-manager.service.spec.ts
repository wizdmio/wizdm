import { TestBed, inject } from '@angular/core/testing';

import { ContentManager } from './content-manager.service';

describe('ContentManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentManager]
    });
  });

  it('should ...', inject([ContentManager], (service: ContentManager) => {
    expect(service).toBeTruthy();
  }));
});
