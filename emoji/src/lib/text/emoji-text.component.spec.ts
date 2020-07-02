import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmojiText } from './emoji-text.component';

describe('EmojiText', () => {
  let component: EmojiText;
  let fixture: ComponentFixture<EmojiText>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmojiText ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmojiText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
