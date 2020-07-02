import { Injectable, TemplateRef, InjectionToken, Inject, Optional } from '@angular/core';
import { filter, map, shareReplay } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

export const TeleportConfigToken = new InjectionToken<TeleportConfig>('wizdm.teleport.config');

export interface TeleportConfig {
  bufferSize?: number;
}

export interface TeleportInstance {
  [target: string]: TeleportPayload;
}

export interface TeleportPayload {
  template: TemplateRef<Object|null>; 
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TeleportService {

  private inner$ = new BehaviorSubject<TeleportInstance>(null);
  readonly beam$: Observable<TeleportInstance>;

  constructor(@Optional() @Inject(TeleportConfigToken) config: TeleportConfig) { 

    this.beam$ = this.inner$.pipe( shareReplay(config?.bufferSize || 1) );
  }

  public beam(name: string): Observable<TeleportPayload> {
    
    return this.beam$.pipe(
      // Filters only those instances targetting the requested portal
      filter( instance => !instance || (name in instance) ),
      // Returns the payload or null
      map( instance => instance && instance[name] ),
    );
  }

  public activate(target: string, template: TemplateRef<Object|null>, data?: any) {
    this.inner$.next({ [target]: { template, data } });
  }

  public clear(target: string) {
    this.inner$.next({ [target]: null });
  }

  public clearAll() { 
    this.inner$.next(null);
  }
}