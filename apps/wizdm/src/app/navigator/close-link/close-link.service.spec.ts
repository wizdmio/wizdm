import { TestBed } from '@angular/core/testing';
import { CloseLinkObserver } from './close-link.service';

describe('CloseLinkObserver', () => {
  let service: CloseLinkObserver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloseLinkObserver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
