import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ResolveLanguage {
  resolveLanguage: () => string | Observable<string>;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageResolver implements ResolveLanguage {

  constructor() { }

  resolveLanguage(): string {
    return '';
  }
}
