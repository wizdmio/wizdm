import { TestBed, inject } from '@angular/core/testing';

import { ScrollViewService } from './scroll-view.service';

describe('ScrollViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrollViewService]
    });
  });

  it('should be created', inject([ScrollViewService], (service: ScrollViewService) => {
    expect(service).toBeTruthy();
  }));
});
