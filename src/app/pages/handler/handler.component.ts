import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wm-handler',
  templateUrl: './handler.component.html',
  styleUrls: ['./handler.component.scss']
})
export class HandlerComponent implements OnInit, OnDestroy {

  private subNav: Subscription;

  constructor(private router : Router, 
              private route : ActivatedRoute) { }

  ngOnInit() {

    // Subscribe to the active route to check if we are signin-in or out
    this.subNav = this.route.queryParamMap.subscribe( (params: ParamMap ) => {

      let mode = params.get('mode');
      let code = params.get('oobCode');
      let lang = params.get('lang') || 'en';

        //...and navigate to the login page
        this.router.navigate([lang,'login'], { 
          queryParams: { mode, code } //, lang }
        });
      }
    );
  }

  ngOnDestroy(){
    this.subNav.unsubscribe();
  }
}
