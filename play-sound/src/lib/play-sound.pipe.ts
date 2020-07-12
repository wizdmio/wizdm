import { Pipe, PipeTransform } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { PlaySoundService } from './play-sound.service';

@Pipe({ name: 'playSound' })
export class PlaySoundPipe implements PipeTransform {

  constructor(private service: PlaySoundService) { }

  transform(value: any, name: string): any {

    if(coerceBooleanProperty(value)) { 
      this.service.playSound(name);
    }

    return value;
  }
}