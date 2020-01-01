import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeCard } from './stripe-card.component';

describe('StripeCard', () => {
  let component: StripeCard;
  let fixture: ComponentFixture<StripeCard>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeCard ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
