import { async, TestBed } from '@angular/core/testing';
import { ReadmeModule } from './readme.module';

describe('ReadmeModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReadmeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ReadmeModule).toBeDefined();
  });
});
