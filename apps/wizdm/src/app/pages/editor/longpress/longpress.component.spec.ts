import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongpressComponent } from './longpress.component';

describe('LongpressComponent', () => {
  let component: LongpressComponent;
  let fixture: ComponentFixture<LongpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LongpressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
