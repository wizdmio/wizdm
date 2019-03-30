import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectHandler } from './redirect-handler.component';

describe('RedirectHandler', () => {
  let component: RedirectHandler;
  let fixture: ComponentFixture<RedirectHandler>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectHandler ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectHandler);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
