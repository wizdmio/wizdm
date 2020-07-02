import { async, TestBed } from '@angular/core/testing';
import { AnimateModule } from './animate.module';

describe('AnimateModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AnimateModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(AnimateModule).toBeDefined();
  });
});
