import { async, TestBed } from '@angular/core/testing';
import { ContentModule } from './content.module';

describe('ContentModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ContentModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ContentModule).toBeDefined();
  });
});
