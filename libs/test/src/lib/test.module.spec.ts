import { async, TestBed } from '@angular/core/testing';
import { TestModule } from './test.module';

describe('TestModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TestModule).toBeDefined();
  });
});
