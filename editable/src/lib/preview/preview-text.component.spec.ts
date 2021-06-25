import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewTextComponent } from './preview-text.component';

describe('PreviewTextComponent', () => {
  let component: PreviewTextComponent;
  let fixture: ComponentFixture<PreviewTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
