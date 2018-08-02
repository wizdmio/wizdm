import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleBrowserComponent } from './people-browser.component';

describe('PeopleBrowserComponent', () => {
  let component: PeopleBrowserComponent;
  let fixture: ComponentFixture<PeopleBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
