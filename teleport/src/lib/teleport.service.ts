import { Injectable, TemplateRef, InjectionToken, Inject, Optional } from '@angular/core';
import { filter, map, scan, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

export const TeleportConfigToken = new InjectionToken<TeleportConfig>('wizdm.teleport.config');

export interface TeleportConfig {
  bufferSize?: number;
}

export interface TeleportPayload {
  action: 'activate'|'clear'|'clearAll';  
  template?: TemplateRef<Object|null>;  
  target?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TeleportService {

  private inner$ = new BehaviorSubject<TeleportPayload>(null);
  readonly beam$: Observable<TeleportPayload>;

  constructor(@Optional() @Inject(TeleportConfigToken) config: TeleportConfig) { 

    this.beam$ = this.inner$.pipe( shareReplay(config?.bufferSize || 1) );
  }

  /** Beam observable streaming the template to render as they occur */
  public beam(name: string): Observable<TeleportPayload> {
    
    return this.beam$.pipe( 
    
      // Filters only those instances targetting the requested portal
      filter( payload => !payload || payload.target === name ),

      // Buffers the requests
      scan( (history, payload) => {

        // Clears all the history
        if(!payload || payload.action === 'clearAll') { return []; }

        // Seeks for the given template in the history first
        const index = history.findIndex( value => value.template === payload.template );

        // Removes the template from the history
        if(index >= 0 && payload.action === 'clear') { return history.splice(index, 1), history; }

        // Activates the new template
        if(payload.action === 'activate') { 
        
          // If already existing, replaces the payload in place
          if(index >= 0) { return history.splice(index, 1, payload), history; }

          // Pushes the new template otherwise
          history.push(payload);
        }

        return history;

      }, []),

      // Emits the last template in history or null
      map( history => history[history.length - 1] || null ), distinctUntilChanged() 
    );
  }

  /** Activates the template at the given target portal */
  public activate(target: string, template: TemplateRef<Object|null>, data?: any) {
    this.inner$.next({ action: 'activate', target, template, data });
  }

  /** Clears the template from the target portal */
  public clear(target: string, template: TemplateRef<Object|null>) {
    this.inner$.next({ action: 'clear', target, template });
  }

  /** Clear all the portals */
  public clearAll() { 
    this.inner$.next({ action: 'clearAll' });
  }
}