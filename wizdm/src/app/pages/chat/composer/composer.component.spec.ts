import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatComposer } from './composer.component';

describe('ChatComposer', () => {
  let component: ChatComposer;
  let fixture: ComponentFixture<ChatComposer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatComposer ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComposer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
