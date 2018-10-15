import { async, TestBed } from '@angular/core/testing';
import { MarkdownModule } from './markdown.module';

describe('MarkdownModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MarkdownModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(MarkdownModule).toBeDefined();
  });
});
