import { TestBed } from '@angular/core/testing';

import { EditableFactoryService } from './editable-factory.service';

describe('EditableFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditableFactoryService = TestBed.get(EditableFactoryService);
    expect(service).toBeTruthy();
  });
});
