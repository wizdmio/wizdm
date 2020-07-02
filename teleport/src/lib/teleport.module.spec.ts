import { async, TestBed } from '@angular/core/testing';
import { TeleportModule } from './teleport.module';

describe('TeleportModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TeleportModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TeleportModule).toBeDefined();
  });
});
