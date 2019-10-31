import { TestBed } from '@angular/core/testing';

import { ContentConfigurator } from './content-configurator.service';

describe('ContentConfigurator', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentConfigurator = TestBed.get(ContentConfigurator);
    expect(service).toBeTruthy();
  });
});
