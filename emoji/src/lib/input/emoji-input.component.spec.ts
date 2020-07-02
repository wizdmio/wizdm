import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiInput } from './emoji-input.component';

describe('EmojiInput', () => {
  let component: EmojiInput;
  let fixture: ComponentFixture<EmojiInput>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmojiInput ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmojiInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
