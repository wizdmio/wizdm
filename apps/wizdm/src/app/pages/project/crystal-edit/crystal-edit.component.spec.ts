import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrystalEditComponent } from './crystal-edit.component';

describe('CrystalEditComponent', () => {
  let component: CrystalEditComponent;
  let fixture: ComponentFixture<CrystalEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrystalEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrystalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
