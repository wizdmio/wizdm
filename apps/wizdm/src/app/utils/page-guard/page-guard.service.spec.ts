import { TestBed } from '@angular/core/testing';
import { PageGuard } from './page-guard.service';

describe('PageGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageGuard = TestBed.get(PageGuard);
    expect(service).toBeTruthy();
  });
});