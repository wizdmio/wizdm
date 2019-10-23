import { async, TestBed } from '@angular/core/testing';
import { PrismModule } from './prism.module';

describe('PrismModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PrismModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PrismModule).toBeDefined();
  });
});
