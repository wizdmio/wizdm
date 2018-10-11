import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreItemComponent } from './item.component';

describe('ExploreItemComponent', () => {
  let component: ExploreItemComponent;
  let fixture: ComponentFixture<ExploreItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
