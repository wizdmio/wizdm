import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wm-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  host: { 'class': 'wm-page adjust-top content-padding' }
})
export class NotFoundComponent implements OnInit, OnDestroy {

  private timeout = null; 
  private countdown = 5;

  constructor(private router: Router) {}

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
