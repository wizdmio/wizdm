import { async, TestBed } from '@angular/core/testing';
import { IpinfoModule } from './ipinfo.module';

describe('IpinfoModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IpinfoModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(IpinfoModule).toBeDefined();
  });
});
