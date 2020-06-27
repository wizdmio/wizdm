import { TestBed } from '@angular/core/testing';
import { AdminObservable } from './is-admin.service';

describe('AdminObservable', () => {
  let service: AdminObservable;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminObservable);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
