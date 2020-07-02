import { async, TestBed } from '@angular/core/testing';
import { RedirectModule } from './redirect.module';

describe('RedirectModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RedirectModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(RedirectModule).toBeDefined();
  });
});
