import { async, TestBed } from '@angular/core/testing';
import { EmojiSupportModule } from './emoji-support.module';

describe('EmojiSupportModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EmojiSupportModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EmojiSupportModule).toBeDefined();
  });
});
