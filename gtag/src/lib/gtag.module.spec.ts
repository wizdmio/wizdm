import { async, TestBed } from '@angular/core/testing';
import { GtagModule } from './gtag.module';

describe('GtagModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GtagModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(GtagModule).toBeDefined();
  });
});
