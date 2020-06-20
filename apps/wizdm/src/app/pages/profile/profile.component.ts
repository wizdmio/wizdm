import { UserData, Users } from 'app/navigator/providers/user-profile';
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

  public get me(): string { return this.users.me.uid; }

  constructor(readonly users: Users, route: ActivatedRoute) { 

    this.user$ = route.paramMap.pipe( switchMap( params => 
      users.fromUserName(params.get('userName')) || 
      users.fromUserId(params.get('userId'))
    ));
  }
}
