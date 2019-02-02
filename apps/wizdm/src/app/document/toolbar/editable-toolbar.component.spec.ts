import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableToolbar } from './editable-toolbar.component';

describe('EditableToolbar', () => {
  let component: EditableToolbar;
  let fixture: ComponentFixture<EditableToolbar>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableToolbar ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
