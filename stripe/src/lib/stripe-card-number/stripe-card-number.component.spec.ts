import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeCardNumberComponent } from './stripe-card-number.component';

describe('StripeCardNumberComponent', () => {
  let component: StripeCardNumberComponent;
  let fixture: ComponentFixture<StripeCardNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeCardNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCardNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
