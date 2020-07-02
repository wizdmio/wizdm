import { TestBed } from '@angular/core/testing';

import { ContentStreamer } from './content-streamer.service';

describe('ContentStreamer', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentStreamer = TestBed.get(ContentStreamer);
    expect(service).toBeTruthy();
  });
});
