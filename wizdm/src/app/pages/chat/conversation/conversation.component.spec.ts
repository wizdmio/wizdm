import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Conversation } from './conversation.component';

describe('Conversation', () => {
  let component: Conversation;
  let fixture: ComponentFixture<Conversation>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Conversation ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Conversation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
