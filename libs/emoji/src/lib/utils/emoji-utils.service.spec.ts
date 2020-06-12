import { TestBed } from '@angular/core/testing';
import { EmojiUtils } from './emoji-utils.service';

describe('EmojiUtils', () => {
  let service: EmojiUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmojiUtils);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
