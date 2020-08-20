import { Directive, Attribute, ViewContainerRef, OnDestroy } from '@angular/core';
import { ActionLinkObserver, ActionDataWithReturn } from '@wizdm/actionlink';
import type { DialogComponent } from '@wizdm/elements/dialog';
import { delay, switchMap } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';

@Directive({
  selector: '[wm-lazy-dialog]'
})
export class LazyDialogDirective<D=any, R=any> implements OnDestroy {

  private dlg: DialogComponent<ActionDataWithReturn<D>, R>;
  private sub: Subscription;

  constructor(@Attribute('wm-lazy-dialog') link: string, actionLink: ActionLinkObserver, view: ViewContainerRef) { 

    if(!link) { throw new Error('wm-lazy-dialog MUST refer to a valid action link'); }

    // Registers at the requested action link
    this.sub = actionLink.register(link).pipe(

      // Extract the lazily loaded module, if any
      switchMap( ({ module, ...data }) => {

        // Already loaded, so, just skips
        if(this.dlg) { return of(data); }

        // Checks for module ref
        if(!module) { throw new Error(
          `The requested action link has no NgModuleRef.
            Make sure to inlucde a valid loadChildren statement within the route configuration.`
        );}

        // Asks for the default Component type
        const component = module.injector.get('default');
        if(!component) { throw new Error(
          `The requested module has no default component defined.
            Make sure to provide the dialog component type with a 'default' token.`
        );}

        // Grab the component factory from the module
        const factory = module.componentFactoryResolver.resolveComponentFactory(component);

        // Creates the dialog component within the view container
        const dlg = view.createComponent(factory).instance as any;
        if(typeof dlg.open !== 'function') { throw new Error(
          `The default component doesn't appear to be a DialogComponent.
           Make sure to provide a DialogComponent as the default compoent.`
        );}

        // Saves the instance for further use
        this.dlg = dlg as DialogComponent;

        // Pass along the data with a delay to make sure the component will be there
        return of(data).pipe( delay(0) );
      })

      // Opens the dialog 
    ).subscribe( data => data.return( this.dlg.open(data)?.afterClosed() ) );
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
