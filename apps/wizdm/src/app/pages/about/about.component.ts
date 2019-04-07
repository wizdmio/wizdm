import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wm-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  readonly msgs = null;
  
  constructor(route: ActivatedRoute) {
    // Gets the localized content resolved during routing
    this.msgs = route.snapshot.data.content.about; 
  }

  ngOnInit() {}
}
