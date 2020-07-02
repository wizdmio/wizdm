import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalloonComponent } from './balloon.component';

describe('BalloonComponent', () => {
  let component: BalloonComponent;
  let fixture: ComponentFixture<BalloonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalloonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalloonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
