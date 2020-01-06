import { TestBed } from '@angular/core/testing';

import { IpList } from './iplist.service';

describe('IpList', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IpList = TestBed.get(IpList);
    expect(service).toBeTruthy();
  });
});
