import { TestBed } from '@angular/core/testing';

import { ToolbarService } from './toolbar.service';

describe('ToolbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToolbarService = TestBed.get(ToolbarService);
    expect(service).toBeTruthy();
  });
});
