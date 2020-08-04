import { Injectable, Optional, Inject, InjectionToken, NgZone } from '@angular/core';
import { APP, FirebaseApp } from '@wizdm/connect';
import { functions } from 'firebase/app';

export type Functions = functions.Functions;
export type Callable<T, R> = (data?:  T) => Promise<R>;
export type CallOptions = functions.HttpsCallableOptions;
export type CallResult = functions.HttpsCallableResult;

export const FUNCTIONS_REGION = new InjectionToken<string>('wizdm.connectc.functions.region');
export const EMULATOR_ORIGIN = new InjectionToken<string>('wizdm.connect.functions.emulator.origin');


@Injectable()
export class FunctionsService {

  readonly functions: Functions;
  readonly url: string;

  constructor(@Inject(APP) app: FirebaseApp, zone: NgZone,
              @Optional() @Inject(FUNCTIONS_REGION) region: string, 
              @Optional() @Inject(EMULATOR_ORIGIN) origin: string) {

    // Runs outside of Angular to avoid triggering unwated change detections
    this.functions = zone.runOutsideAngular( () => {

      // Gets the firebase Functions instance
      const functions = app.functions(region || undefined);

      // Enables the emulator on request 
      origin && functions.useFunctionsEmulator(origin);

      // Returns the requested instance
      return functions;
    });

    // Gets the cloud function base url for further use with http api calls 
    this.url = (typeof (this.functions as any)._url === 'function') ? (this.functions as any)._url('') : 
      // Falls back computing the url as per the firebase sdk 
      ( (origin ? (origin + '/') : `https://${region || 'us-central1'}-`) + `${(app.options as any).projectId}.cloudfunctions.net/` );
  }

  /** Returns the requested callable cloud function */
  public callable<T=any, R=any>(name: string, options?: CallOptions): Callable<T, R> {

    const callable = this.functions.httpsCallable(name, options);
    return (data: T) => callable(data).then( result => result.data as R );
  }
}