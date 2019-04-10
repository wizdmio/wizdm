import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wm-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent {

  readonly msgs;

  constructor(route: ActivatedRoute) { 
    // Gets the localized content
    this.msgs = route.snapshot.data.content.comingSoon;
  }
}