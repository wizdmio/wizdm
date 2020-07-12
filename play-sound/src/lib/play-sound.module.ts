import { PlaySoundDirective, PlaySoundOnClickDirective } from './play-sound.directive';
import { PlaySoundService, SOUNDLIB, SoundLibrary } from './play-sound.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PlaySoundPipe } from './play-sound.pipe';
import { forkJoin } from 'rxjs';


@NgModule({
  imports: [ HttpClientModule ],
  declarations: [ PlaySoundDirective, PlaySoundOnClickDirective, PlaySoundPipe ],
  exports: [ PlaySoundDirective, PlaySoundOnClickDirective, PlaySoundPipe ]
})
export class PlaySoundModule { 

  static init(lib: SoundLibrary): ModuleWithProviders<PlaySoundModule> {

    return {
      ngModule: PlaySoundModule,
      providers: [ { provide: SOUNDLIB, useValue: lib } ]
    }
  }
}
