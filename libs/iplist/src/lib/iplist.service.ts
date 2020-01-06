import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

export interface IpListResult {
  ip: string;
  registry: string,
  countrycode: string,
  countryname: string,
  asn?: IpListAsn;
  detail: string;
  spam: boolean;
  tor: boolean;
}

export interface IpListAsn {
  code: number;
  name: string;
  route: string;
  start: string;
  end: string;
  count: number;
}

/** Check the IP related information from the free https//iplist.cc/api (country level information) */
@Injectable({
  providedIn: 'root'
})
export class IpList extends Observable<IpListResult> {

  // The internal ip$ subject to specify dirfferent ip to inspect
  private ip$ = new BehaviorSubject<string>('');
  // The inner observable making sure all subscriptions replays
  private inner$: Observable<IpListResult>;
  
  constructor(http: HttpClient) { 
    // Simply subscribes to the inner observable
    super( subscriber => this.inner$.subscribe(subscriber) ); 
    // Builds the inner observable to get the ip info from iplist.cc and keeping replaying the last one to all the subscribers
    this.inner$ = this.ip$.pipe( 
      // Queries the iplist API with the give ip
      switchMap( ip => http.get<any>("https://iplist.cc/api/" + ip) ),
      // Replays the last value to all the subscribers
      shareReplay(1)
    );
  }

  /** Checks the give IP. When null the caller IP will be inspected. */
  public checkIP(ip?: string) {
    this.ip$.next(ip || '');
  }
}
