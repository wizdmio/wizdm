import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { $defaultMsgs } from './not-found-defaults';

@Component({
  selector: 'wm-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {

  private timeout = null; 
  public msgs: any;
  public countdown = 5;

  constructor(private router: Router, route: ActivatedRoute) {     
    // Gets the localized content pre-fetched during routing resolving or use 
    // defaults in case we have been redirected after content loading failure
    this.msgs = route.snapshot.data.content.notFound || $defaultMsgs;
  }

  ngOnInit() {

    // Counts down 5 secs before redirecting to Home
    this.timeout = setInterval(() => {

      if(--this.countdown <= 0) {

       this.router.navigate(['/']);
       clearInterval(this.timeout);
      }

    },1000);
  }

  ngOnDestroy() {

    if(this.timeout) { // Prevents unexpected jump to Home in case the user navigated out 
      clearInterval(this.timeout);
    }
  }
}
