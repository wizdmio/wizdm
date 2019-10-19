import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownBlock } from './block.component';

describe('MarkdownBlock', () => {
  let component: MarkdownBlock;
  let fixture: ComponentFixture<MarkdownBlock>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkdownBlock ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
