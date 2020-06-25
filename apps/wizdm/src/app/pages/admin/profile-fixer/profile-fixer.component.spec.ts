import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFixerComponent } from './profile-fixer.component';

describe('ProfileFixerComponent', () => {
  let component: ProfileFixerComponent;
  let fixture: ComponentFixture<ProfileFixerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileFixerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFixerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
