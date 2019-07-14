import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'wm-firebase-handler'
})
export class FirebaseHandler implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    // Intercept the firebase handler parameters
    this.route.queryParamMap.subscribe( (params: ParamMap ) => {

      const mode = params.get('mode');
      const code = params.get('oobCode');
      const api  = params.get('apiKey');
      const lang = params.get('lang') || 'en';
      const url  = params.get('continueUrl');

        //...and navigate to the login page with the requested language
        this.router.navigate([lang,'login'], { 
          queryParams: { mode, code },
          replaceUrl: true
        });
      }
    );
  }
}
