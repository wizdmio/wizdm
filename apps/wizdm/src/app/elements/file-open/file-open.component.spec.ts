import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileOpenComponent } from './file-open.component';

describe('FileOpenComponent', () => {
  let component: FileOpenComponent;
  let fixture: ComponentFixture<FileOpenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileOpenComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
