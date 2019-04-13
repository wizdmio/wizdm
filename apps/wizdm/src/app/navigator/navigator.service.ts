import { Injectable } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ToolbarService, wmAction } from './toolbar/toolbar.service';
import { ViewportService } from './viewport/viewport.service';
export { wmAction };

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  // Global error object
  private errorObj: any;

  constructor(readonly media    : MediaObserver,
              readonly toolbar  : ToolbarService, 
              readonly viewport : ViewportService) {}

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs');/*|| this.media.isActive('sm');*/ }
  public get desktop(): boolean { return !this.mobile; }

  // Global error reporting
  public get error() { return this.errorObj; }
  public reportError(error: any): void { this.errorObj = error; }
  public clearError(): void { this.errorObj = null; }
}
