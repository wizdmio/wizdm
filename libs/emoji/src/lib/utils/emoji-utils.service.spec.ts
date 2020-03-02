import { TestBed } from '@angular/core/testing';

import { EmojiUtilsService } from './emoji-utils.service';

describe('EmojiUtilsService', () => {
  let service: EmojiUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmojiUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
