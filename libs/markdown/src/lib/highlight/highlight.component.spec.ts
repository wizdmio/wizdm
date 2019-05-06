import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeHighlighter } from './highlight.component';

describe('CodeHighlighter', () => {
  let component: CodeHighlighter;
  let fixture: ComponentFixture<CodeHighlighter>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeHighlighter ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeHighlighter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
