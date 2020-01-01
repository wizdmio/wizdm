import { Component } from '@angular/core';
import { RedirectService } from '@wizdm/redirect';

@Component({
  selector: 'wm-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss'],
  host: { 'class': 'wm-page adjust-top content-padding' }
})
export class StaticComponent {

  constructor(readonly redirect: RedirectService) {}
  
}
