import { Component } from '@angular/core';
import { NavigatorService } from '../../navigator';

@Component({
  selector: 'wm-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss'],
  host: { 'class': 'wm-page adjust-top content-padding' }
})
export class StaticComponent {

  constructor(private nav: NavigatorService) {}

  public navigate(url: string) {
    return this.nav.navigateByUrl(url);
  }
}
