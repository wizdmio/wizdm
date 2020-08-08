import { UserData, UserProfile } from 'app/utils/user';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent  {

  readonly user$: Observable<UserData>;

  public get me(): string { return this.user.uid; }

  constructor(readonly user: UserProfile, route: ActivatedRoute) { 

    this.user$ = route.paramMap.pipe( switchMap( params => 
      user.fromUserName(params.get('userName')) || 
      user.fromUserId(params.get('userId'))
    ));
  }
}
