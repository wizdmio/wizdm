import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirebaseHandler } from './firebase-handler.component';

describe('FirebaseHandler', () => {
  let component: FirebaseHandler;
  let fixture: ComponentFixture<FirebaseHandler>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirebaseHandler ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirebaseHandler);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
