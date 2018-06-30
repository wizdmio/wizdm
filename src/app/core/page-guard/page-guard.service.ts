import { Injectable }    from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable }    from 'rxjs';
 
export interface CanPageDeactivate {
 canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
 
@Injectable({
  providedIn: 'root'
})
export class PageGuardService implements CanDeactivate<CanPageDeactivate> {
  canDeactivate(page: CanPageDeactivate) {
    return page.canDeactivate ? page.canDeactivate() : true;
  }
}