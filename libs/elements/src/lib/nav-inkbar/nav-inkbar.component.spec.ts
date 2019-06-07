import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavInkbarComponent } from './nav-inkbar.component';

describe('NavInkbarComponent', () => {
  let component: NavInkbarComponent;
  let fixture: ComponentFixture<NavInkbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavInkbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavInkbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
