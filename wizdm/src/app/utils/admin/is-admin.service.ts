import { AuthService } from '@wizdm/connect/auth';
import { Injectable } from '@angular/core';
import { authorized } from '@wizdm/admin';
import { rootEmail } from 'env/secrets';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminObservable extends Observable<boolean> {

  constructor(auth: AuthService) {

    super( subscriber => auth.user$.pipe( authorized(['admin'], rootEmail) ).subscribe( subscriber ) );

  }
}
