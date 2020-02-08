import { Injectable, TemplateRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActionbarService extends Observable<TemplateRef<any>> {

  private template$ = new BehaviorSubject<TemplateRef<any>>(null);

  constructor() { super( subscriber => this.template$.pipe(delay(0)).subscribe( subscriber )); }

  public activate(template: TemplateRef<any>) {
    this.template$.next(template);
  }

  public clear() { 
    this.template$.next(null);
  }
}
