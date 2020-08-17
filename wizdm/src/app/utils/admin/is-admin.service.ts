import { AuthService, AuthPipeFactory } from '@wizdm/connect/auth';
import { authorized } from 'app/utils/auth-guard';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'env/environment';
const { rootEmail } = environment;

export const isAdmin: AuthPipeFactory = () => authorized(['admin'], rootEmail);

@Injectable({
  providedIn: 'root'
})
export class AdminObservable extends Observable<boolean> {

  constructor(auth: AuthService) {

    super( subscriber => auth.user$.pipe( authorized(['admin'], rootEmail) ).subscribe( subscriber ) );

  }
}
