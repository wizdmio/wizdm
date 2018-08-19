import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContentService, DatabaseService, wmUser, wmProject } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, take, map, tap } from 'rxjs/operators';

export interface UserInfoData {
  userId?: string,
  project?: wmProject,
  user?: wmUser
}

@Component({
  selector: 'wm-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  public user$: Observable<wmUser>;
  public msgs;

  constructor(@Inject(MAT_DIALOG_DATA) private data: UserInfoData,
              private content: ContentService,
              private database: DatabaseService) {

    // Gets the localized content
    this.msgs = this.content.select('profile.info');
  }

  // Loads the user profile from the database
  private loadUser(userId: string): Observable<wmUser> {
    return userId ? this.database.doc$<wmUser>(`users/${userId}`)
      .pipe( take(1) ) : of<wmUser>({});
  }

  ngOnInit() {

    // When project is specified...
    if( this.data.project ) {

      // Uses the owner information when available or load it from the database
      this.user$ = typeof this.data.project.owner === 'string' ?
        this.user$ = this.loadUser(this.data.project.owner) :
          of(this.data.project.owner);
    }
    // Otherwise...
    else {

      // Uses the user information already available or load it from the database
      this.user$ = this.data.user ? of(this.data.user) : 
        this.loadUser(this.data.userId);
    }
  }
}
