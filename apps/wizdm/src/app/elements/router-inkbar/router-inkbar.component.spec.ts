import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterInkbarComponent } from './router-inkbar.component';

describe('RouterInkbarComponent', () => {
  let component: RouterInkbarComponent;
  let fixture: ComponentFixture<RouterInkbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterInkbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterInkbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
