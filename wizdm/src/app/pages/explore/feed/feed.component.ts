import { onSnapshot, where, orderBy, limit, endBefore, docs, snap, page, data } from '@wizdm/connect/database/collection/operators';
import { DatabaseGroup, QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { filter, take, skip, map, tap, expand, startWith, distinctUntilChanged, shareReplay, switchMap } from 'rxjs/operators';
import { DatabaseService } from '@wizdm/connect/database';
import { UserProfile, UserData } from 'app/utils/user';
import { ScrollObservable } from 'app/utils/scrolling';
import { MediaObserver } from '@angular/flex-layout';
import { EmojiUtils } from '@wizdm/emoji/utils';
import { PostData } from './post/post.component';
import { Component } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';

@Component({
  selector: 'wm-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent extends DatabaseGroup<PostData> {

  /** Main feed */
  readonly feed$: Observable<QueryDocumentSnapshot<PostData>[]>;

  // Refreshes the list
  private refresh$ = new BehaviorSubject<void>(null);

  /** Loading items */
  private _loading$ = new BehaviorSubject<number>(5);
  readonly loading$: Observable<number[]>;

  // Tracks the unread posts
  readonly unread$: Observable<string>;

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs'); }
  public get desktop(): boolean { return !this.mobile; }

  /** Refreshes the list of posts */
  public refresh() { this.refresh$.next(null); }

  constructor (db: DatabaseService, scroll: ScrollObservable, private media: MediaObserver) {

    super(db, 'feed');

    // Loading observable returning the array of skeleton items to display during loading
    this.loading$ = this._loading$.pipe( map( length => Array(length).fill(0) ) );

    // Paging observalbe to load the next page while scrolling down
    const more$ = scroll.pipe( 
      // Triggers the next page when approaching the bottom
      map( scroll => scroll.bottom < 250 ),
      // Filters for truthfull changes
      startWith(true), distinctUntilChanged(), filter( value => value ),
      // Asks for the next 5 posts
      map( () => 5 ),
      // Shows the loading items
      tap( value => this._loading$.next(value) )      
    );

    // List of all posts paginated
    this.feed$ = this.refresh$.pipe( switchMap( () => this.pipe( 
      // Query for the public posts in descending order by creation date
      where('tags', 'array-contains', 'public'), orderBy('created', 'desc'),
      // Paginates
      page(more$), 
      // Hides the loading items when done
      tap( () => this._loading$.next(0) ),
      // Buffers the results to avoid reloading 
      shareReplay(1)
    )));

    // Tracks whenever new posts arrived since last refresh
    this.unread$ = this.feed$.pipe( 
      // Filters for changes based on the latest post to avoid unecessary calls to the database
      distinctUntilChanged((x,y) => x[0] === y[0]),       
      // Extracts the latest post only
      map( posts => posts.splice(0, 1)),          
      // Stream for new comers
      expand(posts => this.pipe(
        // Query for more posts 
        where('tags', 'array-contains', 'public'), orderBy('created', 'desc'),
        // Streams the latest document snapshot
        endBefore(posts[0]), onSnapshot(this.db.zone),
        // Filters out not only the empty emissions but also the local ones (still having pending writes).
        filter(posts => posts.size > 0 && !posts.metadata.hasPendingWrites),
        // Takes only one new emission at a time and append the result to the previous posts to minimize the traffic
        take(1), docs(), map(newcomers => newcomers.concat(posts))
      )),
      // Counts the new comers only (subtracting the single original latest post from paging)
      map(posts => posts.length - 1),
      // Maps the number of unread posts into the corresponfing label
      map( count => count <= 0 ? '' : (count > 10 ? '10+' : count.toString()) ), 
      // Filters for changes only
      distinctUntilChanged(),
      // Starts with an empty label
      startWith('')
    );
  }
}
