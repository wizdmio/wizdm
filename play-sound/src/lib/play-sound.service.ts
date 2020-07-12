import { Injectable, Inject, InjectionToken } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export interface SoundOptions {
  volume?: number;
}

export interface SoundLibrary {

  [sound: string]: SoundOptions & {
    buffer?: AudioBuffer;
    url: string;
  };
}

export const SOUNDLIB = new InjectionToken<SoundLibrary>('wizdm.playsound.library', {
  providedIn: 'root',
  factory: () => ({})
});

@Injectable({ providedIn: 'root' })
export class PlaySoundService extends AudioContext {

  constructor(@Inject(SOUNDLIB) readonly soundLibrary: SoundLibrary, private http: HttpClient) { 
    super(); 
  }

  public playSound(name: string, options?: SoundOptions) {

    const sound = this.soundLibrary[name];
    if(!sound) { 

      throw new Error('Requested ' + name + ' sound unavailable'); 
    }

    if(sound.buffer === undefined) {

      this.loadSound(sound.url).subscribe( buffer => { 

        sound.buffer = buffer;
        
        this.playSound(name); 
      });

      return;
    }
    
    const source = this.createBufferSource();
    source.buffer = sound.buffer;

    const volume = this.createGain();
    volume.gain.value = (sound.volume || 1) * (options && options.volume || 1);

    volume.connect(this.destination);
    source.connect(volume);
    source.start();
  }

  public loadSound(url: string): Observable<AudioBuffer> {

    return this.http.get(url, { responseType: 'arraybuffer' }).pipe(
      switchMap( data => this.decodeAudioData(data) ),
      catchError( e => of(null) )
    )
  }
}