import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InkbarComponent } from './inkbar.component';

describe('InkbarComponent', () => {
  let component: InkbarComponent;
  let fixture: ComponentFixture<InkbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InkbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InkbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
