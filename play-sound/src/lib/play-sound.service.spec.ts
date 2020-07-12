import { TestBed } from '@angular/core/testing';

import { PlaySoundService } from './play-sound.service';

describe('PlaySoundService', () => {
  let service: PlaySoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaySoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
