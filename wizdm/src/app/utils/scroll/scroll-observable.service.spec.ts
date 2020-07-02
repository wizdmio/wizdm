import { TestBed } from '@angular/core/testing';
import { ScrollObservable } from './scroll-observable.service';

describe('ScrollObservable', () => {
  let service: ScrollObservable;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollObservable);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
