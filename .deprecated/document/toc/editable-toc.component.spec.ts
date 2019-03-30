import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableToc } from './editable-toc.component';

describe('EditableToc', () => {
  let component: EditableToc;
  let fixture: ComponentFixture<EditableToc>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableToc ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableToc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
