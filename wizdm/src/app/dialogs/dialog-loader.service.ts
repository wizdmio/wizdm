import { Injectable, NgModuleRef } from '@angular/core';
import { ActionLinkObserver, ActionData } from '@wizdm/actionlink';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, isObservable, from, of } from 'rxjs';
import { filter, take, skip, map, switchMap, takeUntil, tap } from 'rxjs/operators';

export type DialogResult<T = any> = void|T|Promise<T>|Observable<T>;

@Injectable({
  providedIn: 'root'
})
export class DialogLoader extends ActionLinkObserver {

  readonly dialogs$: Observable<{ action: string, module: NgModuleRef<any>, data?: ActionData }>;

  // Builds a ReplaySubject to be used for returning values asynchronously
  private return$ = new ReplaySubject<DialogResult>(1);

  constructor(router: Router) { 
    
    super(router); 

    /** Builds the dialogs stream */
    this.dialogs$ = this.observers$.pipe( 
      
      // Filters for routes containing the DialogLoader only
      filter( ({ route }) => !!route?.routeConfig?.canActivate?.find( item => item === DialogLoader )),

      map( ({ action, route }) => {

        // Extracts the internal NgModule ref eventually loaded while routing according to loadChildren
        const module: NgModuleRef<any> = (route?.routeConfig as any)?._loadedConfig?.module;

        return { action, module, data: this.actionData(route) };
      })
    );
  }

  /** Activate a dialog programmatically */
  public open<T>(dialog: string, data?: ActionData): Observable<T> {

    // Triggers the dialog opened by navigation lazily loading the moduel whenever necessary
    this.router.navigate(['/' + dialog], { skipLocationChange: true, queryParams: data });

    // Returns an Observavble resolving into the returned value
    return this.return$.pipe( 

        // Completes the observable with the next dialog activation (worst case)
        takeUntil(this.dialogs$.pipe(skip(1))),
        
        // Transforms the given result
        switchMap( result => {

          // Returns thee given observable
          if(isObservable(result)) { return result as Observable<T>; }

          // Converts the Promise into observable
          if(Promise.resolve(result) == result) { return from(result as Promise<T>); }

          // Converts the value into observable
          return of(result as T);
        }),
        
        // Takes a single emission at max
        take(1)
    );  
  }

  /** Pushes the next returned value */
  public return<T>(value: DialogResult<T>) { 
    value && this.return$.next(value); 
  }
}
