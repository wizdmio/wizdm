import { map, take, filter, shareReplay, takeWhile } from 'rxjs/operators';
import { DatabaseCollection } from '@wizdm/connect/database/collection';
import { DatabaseService } from '@wizdm/connect/database';
import { UserProfile, UserData } from './user.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Users extends DatabaseCollection<UserData> {

  private cache: { [key: string]: Observable<UserData> } = {}; 

  constructor(readonly me: UserProfile, db: DatabaseService) {
    super(db, 'users');
  }

  public fromUserId(userId: string): Observable<UserData> {

    if(!userId) { return null; }

    if(userId === this.me.uid) { return this.me.data$; }

    const cached = this.cache[userId];
    if(cached) { return cached; }

    const streamed = this.document(userId).stream().pipe( 
      takeWhile( data => data != null, true ),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    streamed.pipe( take(1), filter( data => !!data ) ).subscribe( data => {
      
      this.cache[userId] = streamed;
      
      if(data.userName) { this.cache[data.userName] = streamed; }
    });

    return streamed;
  }

  public fromUserName(userName: string): Observable<UserData> {

    if(!userName) { return null; }

    if(userName === this.me.data.userName) { return this.me.data$; }

    const cached = this.cache[userName];
    if(cached) { return cached; }

    const streamed = this.stream( qf => qf.where('userName', '==', userName) ).pipe( 
      map( users => users.length ? users[0] : null ), 
      takeWhile( data => data != null, true ),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    streamed.pipe( take(1), filter( data => !!data ) ).subscribe( data => {
      this.cache[userName] = this.cache[data.id] = streamed;
    });

    return streamed;
  }

  /** Returns true wheneve the given user name is taken */
  public doesUserNameExists(userName: string): Observable<boolean> {

    return this.fromUserName( userName.replace(/\s*/g, '').toLowerCase() ).pipe( 
      take(1), map( data => !!data && data.id !== this.me.uid )
    )
  }
}