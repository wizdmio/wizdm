import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySoundComponent } from './play-sound.component';

describe('PlaySoundComponent', () => {
  let component: PlaySoundComponent;
  let fixture: ComponentFixture<PlaySoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaySoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaySoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
