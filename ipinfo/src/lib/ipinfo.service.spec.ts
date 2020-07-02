import { TestBed } from '@angular/core/testing';

import { IpInfo } from './ipinfo.service';

describe('IpInfo', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IpInfo = TestBed.get(IpInfo);
    expect(service).toBeTruthy();
  });
});
