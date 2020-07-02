import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismHighlighter } from './highlighter.component';

describe('PrismHighlighter', () => {
  let component: PrismHighlighter;
  let fixture: ComponentFixture<PrismHighlighter>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismHighlighter ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismHighlighter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
