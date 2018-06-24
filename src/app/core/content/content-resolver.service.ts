import { Injectable } from '@angular/core';
import { Router, 
         Resolve, 
         RouterStateSnapshot, 
         ActivatedRouteSnapshot } from '@angular/router';

import { ContentManager } from './content-manager.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ContentResolver implements Resolve<any> {

  constructor(private content: ContentManager, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    
    let lang = route.params['lang'];

    // Loads the requested lanuage, perform defaults in case of errors  
    // NOTE: error handling is already taken care by the ContentEvent
    return this.content.use(lang);/*.pipe(catchError( error => {

      // This usually redirects to an error page
      this.content.emit({ reason: 'error', data: lang });
      
      return of<any>(null);
    }));*/
  }
}
