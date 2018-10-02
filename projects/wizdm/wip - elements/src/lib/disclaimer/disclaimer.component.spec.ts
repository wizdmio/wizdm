import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclaimerComponent } from './disclaimer.component';

describe('DisclaimerComponent', () => {
  let component: DisclaimerComponent;
  let fixture: ComponentFixture<DisclaimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclaimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
