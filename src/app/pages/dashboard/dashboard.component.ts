import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ContentManager, AuthService } from 'app/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private subNav: Subscription;
  private msgs = null;
  
  constructor(private router: Router, 
              private route: ActivatedRoute, 
              private content: ContentManager,
              private auth: AuthService) {}

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('dashboard');

    this.subNav = this.route.queryParamMap.subscribe( (params: ParamMap) => {

      let action = params.get('project') || '';

      console.log('login mode: ' + action);
    
    });
  }

  ngOnDestroy() {
    this.subNav.unsubscribe();
  }
}
