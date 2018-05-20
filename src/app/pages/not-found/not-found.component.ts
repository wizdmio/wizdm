import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ContentManager } from 'app/content';

import 'app/utils/handy/interpolate';

import { $defaultMsgs } from './not-found-defaults';

@Component({
  selector: 'rs-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {

  private countdown: number = 5;
  private timeout = null; 
  private msgs: any;

  constructor(private content: ContentManager,
              private router: Router) { }

  ngOnInit() {

    // Gets the messages from the content manager or use defaults
    // in case we have been redirected after content loading failure
    this.msgs = this.content.select('notFound', $defaultMsgs);

    // Makes sure to use the 'red' navigation theme
    this.content.emit({ reason: "theme", data: "red/red" });

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
