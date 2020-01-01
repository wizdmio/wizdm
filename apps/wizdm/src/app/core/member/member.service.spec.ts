import { TestBed } from '@angular/core/testing';

import { Member } from './member.service';

describe('Member', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Member = TestBed.get(Member);
    expect(service).toBeTruthy();
  });
});
