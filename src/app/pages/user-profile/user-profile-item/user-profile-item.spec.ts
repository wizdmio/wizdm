import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileItemComponent } from './user-profile-item.component';

describe('UserProfileItemComponent', () => {
  let component: UserProfileItemComponent;
  let fixture: ComponentFixture<UserProfileItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
