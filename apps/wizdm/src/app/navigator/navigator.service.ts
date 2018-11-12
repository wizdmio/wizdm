import { Injectable } from '@angular/core';
import { ToolbarService, wmAction } from './toolbar/toolbar.service';
export { wmAction };

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  // Global error object
  private errorObj: any;

  constructor(readonly toolbar: ToolbarService) {}
  
  public get error() {
    return this.errorObj;
  }

  public reportError(error: any): void {
    this.errorObj = error;
  }

  public clearError(): void {
    this.errorObj = null;
  }
}
