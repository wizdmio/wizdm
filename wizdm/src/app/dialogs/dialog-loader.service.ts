import { Injectable, NgModuleRef, Type } from '@angular/core';
import { Resolve, Routes } from '@angular/router';
import { ActionLinkObserver, ActionData } from '@wizdm/actionlink';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, isObservable, from, of, forkJoin } from 'rxjs';
import { filter, take, skip, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DialogComponent } from '@wizdm/elements/dialog';

export type DialogResult<T = any> = void|T|Promise<T>|Observable<T>;

export interface DialogStream {
  action: string; 
  module: NgModuleRef<any>, 
  component: Type<DialogComponent>,
  data?: ActionData
};

/** Lazy Dialog Module Loader. Use this class as a canActivate guard within a regular lazy loading route. */
@Injectable()
export class DialogLoader extends ActionLinkObserver {

  /** Dialogs stream */
  readonly dialogs$: Observable<DialogStream>;

  // Builds a ReplaySubject to be used for returning values asynchronously
  private return$ = new ReplaySubject<DialogResult>(1);

  constructor(router: Router) { 
    
    super(router); 

    /** Builds the dialogs stream */
    this.dialogs$ = this.observers$.pipe( 
      
      // Filters for routes containing the DialogLoader only
      filter( ({ route }) => !!route?.routeConfig?.canActivate?.find( item => item === DialogLoader )),

      switchMap( ({ action, route, state }) => {

        // Extracts the internal NgModule ref eventually lazily loaded
        const module: NgModuleRef<any> = (route?.routeConfig as any)?._loadedConfig?.module;

        // Extracts the internal routes eventually lazily loaded
        const routes: Routes = (route?.routeConfig as any)?._loadedConfig?.routes || [];

        // Seeks for the primary child route where to find the dialog component
        const root = routes.find( ({ path }) => path === '');

        // Gets the dialog component
        const component = root?.component;

        // Extracts the resolve configuration, if any
        const resolve = root?.resolve;
        if(!root?.resolve) { return of({ action, module, component, data: this.actionData(route) }); }

        // Runs the resolvers
        return forkJoin( Object.keys(resolve).map( key => {

          // Gets the resolver instance from the module injector
          const resolver: Resolve<any> = module.injector.get(resolve[key]);
          if(typeof resolver.resolve !== 'function') { return of(null); }

          // Runs the resolver turning the results into an observable
          return this.toObservable(resolver.resolve(route, state))
            .pipe( map( data => ({ key, data }) ));

        })).pipe( map( resolvedArray => {

          // Composes the dialog data merging both the original query parameters from the activeLink and the resolved content
          const data = resolvedArray.reduce( (data, item) => (data[item.key] = item.data, data), this.actionData(route) );

          return { action, module, component, data };
        }))
      })
    );
  }

  /** Activate a dialog programmatically */
  public open<T>(dialog: string, data?: ActionData): Observable<T> {

    // Triggers the dialog opened by navigation lazily loading the module whenever necessary
    this.router.navigate(['/' + dialog], { skipLocationChange: true, queryParams: data });

    // Returns an Observavble resolving into the returned value
    return this.return$.pipe( 

        // Completes the observable with the next dialog activation (worst case)
        takeUntil(this.dialogs$.pipe(skip(1))),
        
        // Transforms the given result
        switchMap( result => this.toObservable(result) ),
        
        // Takes a single emission at max
        take(1)
    );  
  }

  /** Pushes the next returned value */
  public return<T>(value: DialogResult<T>) { 
    value && this.return$.next(value); 
  }

  /** Asses the given value and return an Observable of it */
  private toObservable<T>(value: T|Promise<T>|Observable<T>): Observable<T> {

    // Returns the given observable
    if(isObservable(value)) { return value as Observable<T>; }

    // Converts the Promise into observable
    if(Promise.resolve(value) == value) { return from(value as Promise<T>); }

    // Converts the value into observable
    return of(value as T);
  }
}
