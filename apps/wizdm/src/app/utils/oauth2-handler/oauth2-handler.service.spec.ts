import { TestBed } from '@angular/core/testing';

import { Oauth2HandlerService } from './oauth2-handler.service';

describe('Oauth2HandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Oauth2HandlerService = TestBed.get(Oauth2HandlerService);
    expect(service).toBeTruthy();
  });
});
