import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismHighlihter } from './highlighter.component';

describe('PrismHighlihter', () => {
  let component: PrismHighlihter;
  let fixture: ComponentFixture<PrismHighlihter>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismHighlihter ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismHighlihter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
