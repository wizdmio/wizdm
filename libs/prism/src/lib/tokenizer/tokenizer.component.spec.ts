import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismTokenizer } from './tokenizer.component';

describe('PrismTokenizer', () => {
  let component: PrismTokenizer;
  let fixture: ComponentFixture<PrismTokenizer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismTokenizer ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismTokenizer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
