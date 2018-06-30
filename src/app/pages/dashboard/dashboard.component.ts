import { Component, OnInit } from '@angular/core';
import { ContentManager, AuthService } from 'app/core';

@Component({
  selector: 'wm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private msgs = null;
  
  constructor(private content: ContentManager,
              private auth: AuthService) {}

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('dashboard');
  }
}
