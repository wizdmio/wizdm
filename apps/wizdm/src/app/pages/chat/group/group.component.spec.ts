import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGroup } from './group.component';

describe('ChatGroup', () => {
  let component: ChatGroup;
  let fixture: ComponentFixture<ChatGroup>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatGroup ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
