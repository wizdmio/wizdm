import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsPrivacyPopupComponent } from './terms-privacy-popup.component';

describe('TermsPrivacyPopupComponent', () => {
  let component: TermsPrivacyPopupComponent;
  let fixture: ComponentFixture<TermsPrivacyPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsPrivacyPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsPrivacyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
