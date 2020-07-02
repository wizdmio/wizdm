import { TestBed } from '@angular/core/testing';

import { EditableFactory } from './editable-factory.service';

describe('EditableFactory', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditableFactory = TestBed.get(EditableFactory);
    expect(service).toBeTruthy();
  });
});
