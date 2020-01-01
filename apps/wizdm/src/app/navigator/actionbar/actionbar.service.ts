import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionbarService extends BehaviorSubject<TemplateRef<any>> {

  constructor() { super(null); }

  public activate(template: TemplateRef<any>) {
    this.next(template);
  }

  public clear() { 
    this.next(null);
  }
}
