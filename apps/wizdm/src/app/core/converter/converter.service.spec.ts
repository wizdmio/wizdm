import { TestBed } from '@angular/core/testing';

import { EditableConverter } from './converter.service';

describe('EditableConverter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditableConverter = TestBed.get(EditableConverter);
    expect(service).toBeTruthy();
  });
});
