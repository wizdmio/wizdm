import { Component } from '@angular/core';
import { RedirectService } from '@wizdm/redirect';

@Component({
  selector: 'wm-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss'],
  host: { 'class': 'padding-top-toolbar' }
})
export class StaticComponent {

  constructor(readonly redirect: RedirectService) {}
  
}
