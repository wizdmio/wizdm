import { Injectable } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ToolbarService, wmAction } from '../apps/wizdm/src/app/navigator/toolbar/toolbar.service';
import { ViewportService } from './viewport/viewport.service';
export { wmAction };

@Injectable()
export class NavigatorService {


  constructor(readonly media    : MediaObserver,
              readonly toolbar  : ToolbarService, 
              readonly viewport : ViewportService) { }

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs');/*|| this.media.isActive('sm');*/ }
  public get desktop(): boolean { return !this.mobile; }

}
