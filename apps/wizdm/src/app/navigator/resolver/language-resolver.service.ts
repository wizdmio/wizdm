import { Injectable } from '@angular/core';
import { ResolveLanguage } from '@wizdm/content';
import { UserProfile } from '@wizdm/connect';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserLanguageResolver implements ResolveLanguage {

  constructor(private user: UserProfile) {}

  // Implements a basic language resolver returning the user preferred language
  // captured from the user profile stored in the database. Since this observable
  // pipes from the AuthService this resolver grants the page won't show up before
  // the user authentication has been checked avoinding page flickering effects
  public resolveLanguage(): string | Observable<string> {

    return this.user.asObservable()
      .pipe( first(), map( profile => {
        return !!profile ? profile.lang : null;
      }));
  }
}
