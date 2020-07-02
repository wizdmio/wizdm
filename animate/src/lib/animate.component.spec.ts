import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimateComponent } from './animate.component';

describe('AnimateComponent', () => {
  let component: AnimateComponent;
  let fixture: ComponentFixture<AnimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
