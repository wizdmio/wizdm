import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableMenu } from './editable-menu.component';

describe('EditableMenu', () => {
  let component: EditableMenu;
  let fixture: ComponentFixture<EditableMenu>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableMenu ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
