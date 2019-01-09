import { TestBed, inject } from '@angular/core/testing';

import { MailerliteService } from './mailerlite.service';

describe('MailerliteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MailerliteService]
    });
  });

  it('should ...', inject([MailerliteService], (service: MailerliteService) => {
    expect(service).toBeTruthy();
  }));
});
