import { TestBed, inject } from '@angular/core/testing';

import { TranslateResolver } from './translate-resolver.service';

describe('TranslateResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslateResolver]
    });
  });

  it('should ...', inject([TranslateResolver], (service: TranslateResolver) => {
    expect(service).toBeTruthy();
  }));
});
