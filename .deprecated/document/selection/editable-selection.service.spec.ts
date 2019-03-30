import { TestBed } from '@angular/core/testing';

import { EditableSelection } from './editable-selection.service';

describe('EditableSelection', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditableSelection = TestBed.get(EditableSelection);
    expect(service).toBeTruthy();
  });
});
