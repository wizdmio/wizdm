import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsPrivacyComponent } from './terms-privacy.component';

describe('TermsPrivacyComponent', () => {
  let component: TermsPrivacyComponent;
  let fixture: ComponentFixture<TermsPrivacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsPrivacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
