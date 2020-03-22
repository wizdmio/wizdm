import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatViewer } from './viewer.component';

describe('ChatViewer', () => {
  let component: ChatViewer;
  let fixture: ComponentFixture<ChatViewer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatViewer ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
