import { Component, OnInit, OnDestroy } from '@angular/core';
import { RedirectService } from '@wizdm/redirect';

@Component({
  selector: 'wm-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {

  private timeout = null; 
  private countdown = 5;

  constructor(private redirect: RedirectService) {}

  ngOnInit() {

    // Counts down 5 secs before redirecting Back
    this.timeout = setInterval(() => {

      if(--this.countdown <= 0) {
        // Redirects to home
        this.redirect.navigate('back');
      }

    },1000);
  }

  ngOnDestroy() {
    // Clears the timeout on leaving
    clearInterval(this.timeout);
  }
}
