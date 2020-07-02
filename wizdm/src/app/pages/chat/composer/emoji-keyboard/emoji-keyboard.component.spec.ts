import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiKeyboard } from './emoji-keyboard.component';

describe('EmojiKeyboard', () => {
  let component: EmojiKeyboard;
  let fixture: ComponentFixture<EmojiKeyboard>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmojiKeyboard ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmojiKeyboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
