import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabPortalComponent } from './fab-portal.component';

describe('FabPortalComponent', () => {
  let component: FabPortalComponent;
  let fixture: ComponentFixture<FabPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
