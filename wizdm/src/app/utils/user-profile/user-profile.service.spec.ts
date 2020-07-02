import { TestBed } from '@angular/core/testing';
import { UserProfile } from './user.service';

describe('UserProfile', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserProfile = TestBed.get(UserProfile);
    expect(service).toBeTruthy();
  });
});
