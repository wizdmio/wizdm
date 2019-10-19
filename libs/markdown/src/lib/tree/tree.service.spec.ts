import { TestBed } from '@angular/core/testing';

import { MarkdownTree } from './tree.service';

describe('MarkdownTree', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarkdownTree = TestBed.get(MarkdownTree);
    expect(service).toBeTruthy();
  });
});
