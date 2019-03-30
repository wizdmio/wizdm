import { async, TestBed } from '@angular/core/testing';
import { EditableModule } from './editable.module';

describe('EditableModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EditableModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EditableModule).toBeDefined();
  });
});
