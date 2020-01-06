import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

export interface IpInfoConfig {

  url?: string;// "https://ipinfo.io/",
  token?: string;
}

export const IpInfoConfigToken = new InjectionToken<IpInfoConfig>('wizdm.ipinfo.config');

export interface IpInfoResult {

  ip: string,
  city: string,
  region: string,
  country: string,
  loc: string,
  postal: number,
  timezone: string,
  readme?: string
}

/** Gets IP information form ipinfo.io */
@Injectable()
export class IpInfo extends Observable<IpInfoResult> {

  // The internal ip$ subject to specify dirfferent ip to inspect
  private ip$ = new BehaviorSubject<string>('');
  // The inner observable making sure all subscriptions replays
  private inner$: Observable<IpInfoResult>;

  constructor(http: HttpClient, @Inject(IpInfoConfigToken) private config: IpInfoConfig) { 
    // Simply subscribes to the inner observable
    super( subscriber => this.inner$.subscribe(subscriber) ); 
    // Builds the inner observable to get the ip info
    this.inner$ = this.ip$.pipe( 
      // Queries the ipinfo.io API with the give ip
      switchMap( ip => http.get<any>(this.base + (ip ? '/' + ip : '') + '/geo?token=' + this.config.token) ),
      // Replays the last value to all the subscribers
      shareReplay(1)
    );
  }

  private get base(): string {
    // Makes sure the baser url always ends up clean
    return (this.config.url && this.config.url.endsWith('/') ? this.config.url.slice(0, -1) : this.config.url) || "https://ipinfo.io";
  }

  /** Checks the given IP. When null the caller IP will be inspected. */
  public checkIP(ip?: string) {
    this.ip$.next(ip || '');
  }
}
