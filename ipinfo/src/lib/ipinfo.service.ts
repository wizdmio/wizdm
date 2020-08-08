import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';
import { map, tap, switchMap, catchError, shareReplay } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface IpInfoConfig {

  provider: string;
  apiKey?: string;
}

export const IPINFO_CONFIG = new InjectionToken<IpInfoConfig>('wizdm.ipinfo.config');

/** Gets IP information form ipinfo.io */
@Injectable()
export class IpInfo<T> extends Observable<T> {

  // The internal ip$ subject to specify dirfferent ip to inspect
  private ip$ = new BehaviorSubject<string>('');
  // The inner observable making sure all subscriptions replays
  private inner$: Observable<T>;

  constructor(http: HttpClient, @Optional() @Inject(IPINFO_CONFIG) private config: IpInfoConfig) { 
    // Simply subscribes to the inner observable
    super( subscriber => this.inner$.subscribe(subscriber) ); 

    // Check for a valid provider
    if(!config || typeof(config.provider) !== 'string') {
      throw new Error('IpConfig requires a valid provider');
    } 

    // Builds the inner observable to get the ip info
    this.inner$ = this.ip$.pipe( 
      // Maps the requested ip into the full end-point api call
      map( ip => this.endPoint(ip, config) ),
      // Debug
      tap( ep => console.log("Requesting ip info from:", ep) ),
      // Queries the ipinfo.io API with the given ip preventing errors from completing the inner observable
      switchMap( url => http.get<T>(url).pipe( catchError( e => {
        // Reports a warning
        console.warn(`Something went wrong while attemtping to retrive ip geolocation info from ${config?.provider}`, e);        
        return of({} as T); 
      }))),
      // Replays the last value to all the subscribers
      shareReplay(1)
    );
  }

  /** Returns the last requested IP, if any */
  public get lastIP(): string { return this.ip$.value || ''; }

  /** Checks the given IP. When null the caller IP will be inspected. */
  public checkIP(ip?: string) {
    this.ip$.next(ip || '');
  }

  /** Computes the endPoint api call based on the given parameters */
  public endPoint(ip: string = this.lastIP, config: IpInfoConfig = this.config): string {

    return config.provider
      // Applies the optional ip
      .replace(/{{\s*ip\s*}}/, ip || '')
      // Applies the optional apiKey
      .replace(/{{\s*apiKey\s*}}/, config.apiKey || '')
      // Removes unwanted double slashes resulting from a missing optional segments
      .replace(/([^:]\/)\//g, '$1')
      // Removes unwanted forward slashes preceding the extension like format selection 
      .replace(/\/\./, '.')
      // Removes empty query parameters resulting from missing optional parameters
      .replace(/\w+=(?:;|$)/g, '').replace(/\?$/,'');
  }
}
