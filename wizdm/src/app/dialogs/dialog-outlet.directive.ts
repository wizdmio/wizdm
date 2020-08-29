import { Directive, ViewContainerRef, OnDestroy } from '@angular/core';
import type { DialogComponent } from '@wizdm/elements/dialog';
import { DialogLoader } from './dialog-loader.service';
import { delay, switchMap } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';

@Directive({
  selector: 'dialog-outlet, [dialog-outlet]'
})
export class DialogOutletDirective implements OnDestroy {

  private dlgs: { [action: string]: DialogComponent<any, any> } = {};
  private sub: Subscription;

  constructor(loader: DialogLoader, view: ViewContainerRef) { 

    // Registers at the requested action link
    this.sub = loader.dialogs$.pipe(

      // Extract the lazily loaded module, if anyn
      switchMap( ({ action, module, data }) => {

        // Already loaded, so, just skips
        if(this.dlgs[action]) { return of({ dlg: this.dlgs[action], data }); }
        
        // Checks for module ref
        if(!module) { throw new Error(
          `The requested action link has no NgModuleRef.
            Make sure to include a valid loadChildren statement within the route configuration.`
        );}

        // Asks for the dialog Component type
        const component = module.injector.get('dialog');
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
        this.dlgs[action] = dlg as DialogComponent;

        // Pass along the data with a delay to make sure the component will be there
        return of({ dlg, data }).pipe( delay(0) );
      })

      // Opens the dialog 
    ).subscribe( ({ dlg, data }) => loader.return( dlg.open(data)?.afterClosed() ) );
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
