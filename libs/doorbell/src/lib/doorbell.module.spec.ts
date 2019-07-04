import { async, TestBed } from '@angular/core/testing';
import { DoorbellModule } from './doorbell.module';

describe('DoorbellModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DoorbellModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(DoorbellModule).toBeDefined();
  });
});
