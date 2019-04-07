import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  readonly msgs = null;
  
  constructor(route: ActivatedRoute) {
    // Gets the localized content pre-fetched during routing resolving
    this.msgs = route.snapshot.data.content.dashboard;
  }

  ngOnInit() {
  }

}
