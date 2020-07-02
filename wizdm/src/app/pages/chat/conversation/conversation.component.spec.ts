import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatConversation } from './conversation.component';

describe('ChatConversation', () => {
  let component: ChatConversation;
  let fixture: ComponentFixture<ChatConversation>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatConversation ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatConversation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
