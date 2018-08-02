import { TestBed, inject } from '@angular/core/testing';

import { WindowRef } from './window.service';

describe('WindowRef', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowRef]
    });
  });

  it('should be created', inject([WindowRef], (service: WindowRef) => {
    expect(service).toBeTruthy();
  }));
});
