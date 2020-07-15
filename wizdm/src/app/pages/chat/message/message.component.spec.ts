import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessage } from './message.component';

describe('ChatMessage', () => {
  let component: ChatMessage;
  let fixture: ComponentFixture<ChatMessage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatMessage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
