import { Directive, OnInit, Input, HostListener } from '@angular/core';
import { PlaySoundService } from './play-sound.service';

@Directive({
  selector: '[playSound]'
})
export class PlaySoundDirective implements OnInit {

  @Input('playSoundOnClick') name: string;

  ngOnInit() {
    this.service.playSound(this.name);
  }

  constructor(private service: PlaySoundService) { }
}

@Directive({
  selector: '[playSoundOnClick]'
})
export class PlaySoundOnClickDirective {

  @Input('playSoundOnClick') name: string;

  @HostListener('click') onClick() {
    this.service.playSound(this.name);
  }

  constructor(private service: PlaySoundService) { }
}