import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownInline } from './inline.component';

describe('MarkdownInline', () => {
  let component: MarkdownInline;
  let fixture: ComponentFixture<MarkdownInline>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkdownInline ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownInline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
