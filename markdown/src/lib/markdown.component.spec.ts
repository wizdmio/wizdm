import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownRoot } from './markdown.component';

describe('MarkdownRoot', () => {
  let component: MarkdownRoot;
  let fixture: ComponentFixture<MarkdownRoot>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkdownRoot ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownRoot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
