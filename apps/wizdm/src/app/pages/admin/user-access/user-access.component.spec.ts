import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAccessComponent } from './user-access.component';

describe('UserAccessComponent', () => {
  let component: UserAccessComponent;
  let fixture: ComponentFixture<UserAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
