import { Component, 
         OnInit,
         OnDestroy } from '@angular/core';
import { ContentManager, 
         AuthService, 
         User } from 'app/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private msgs = null;
  private user: User = null;
  private userImage: string = null;
  private sub: Subscription = null;

  constructor(private content: ContentManager,
              private auth: AuthService) {}

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('dashboard');

    // Subribe to get a snapshot of the user profile
    this.sub = this.auth.user.subscribe( user => { 
      this.user = user;
      this.userImage = user.photoURL;
    });  
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  userData(key: string): string {
    return this.user ? this.user[key] : '';
  }
}
