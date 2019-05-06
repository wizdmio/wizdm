import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownRenderer } from './markdown.component';

describe('MarkdownRenderer', () => {
  let component: MarkdownRenderer;
  let fixture: ComponentFixture<MarkdownRenderer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkdownRenderer ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownRenderer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
